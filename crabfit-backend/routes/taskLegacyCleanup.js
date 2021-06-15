const dayjs = require('dayjs');

module.exports = async (req, res) => {
  if (req.header('X-Appengine-Cron') === undefined) {
    return res.status(400).send('This task can only be run from a cron job');
  }

  const threeMonthsAgo = dayjs().subtract(3, 'month').unix();

  console.log(`Running LEGACY cleanup task at ${dayjs().format('h:mma D MMM YYYY')}`);

	try {
    // Fetch events that haven't been visited in over 3 months
    const eventQuery = req.datastore.createQuery(req.types.event).order('created');
		let oldEvents = (await req.datastore.runQuery(eventQuery))[0];

    oldEvents = oldEvents.filter(event => !event.hasOwnProperty('visited'));

		if (oldEvents && oldEvents.length > 0) {
      console.log(`Found ${oldEvents.length} events that were missing a visited date`);

      // Filter events that are older than 3 months and missing a visited date
      oldEvents = oldEvents.filter(event => event.created < threeMonthsAgo);

      if (oldEvents && oldEvents.length > 0) {
        let oldEventIds = oldEvents.map(e => e[req.datastore.KEY].name);

        // Fetch availabilities linked to the events discovered
        let eventsRemoved = 0;
        let peopleRemoved = 0;
        await Promise.all(oldEventIds.map(async (eventId) => {
          const peopleQuery = req.datastore.createQuery(req.types.person).filter('eventId', eventId);
      		let oldPeople = (await req.datastore.runQuery(peopleQuery))[0];

          let deleteEvent = true;
          if (oldPeople && oldPeople.length > 0) {
            oldPeople.forEach(person => {
              if (person.created >= threeMonthsAgo) {
                deleteEvent = false;
              }
            });
          }
          if (deleteEvent) {
            if (oldPeople && oldPeople.length > 0) {
              peopleRemoved += oldPeople.length;
              await req.datastore.delete(oldPeople.map(person => person[req.datastore.KEY]));
            }
            eventsRemoved++;
            await req.datastore.delete(req.datastore.key([req.types.event, eventId]));
          }
        }));

        console.log(`Legacy cleanup successful: ${eventsRemoved} events and ${peopleRemoved} people removed`);

  			res.sendStatus(200);
    	} else {
        console.log('Found 0 events that are older than 3 months and missing a visited date, ending LEGACY cleanup');
    		res.sendStatus(404);
    	}
		} else {
      console.error('Found no events that are missing a visited date, ending LEGACY cleanup [DISABLE ME!]');
			res.sendStatus(404);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(404);
	}
};
