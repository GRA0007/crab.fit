// TODO: This is temporary, as I've made the decision to move away
// from a PWA, so must remove all existing service workers

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", () => {
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client.url && "navigate" in client) {
          client.navigate(client.url)
        }
      })
    })
})
