use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        print!("Setting up database...");

        // Stats table
        manager
            .create_table(
                Table::create()
                    .table(Stats::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Stats::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Stats::EventCount).integer().not_null())
                    .col(ColumnDef::new(Stats::PersonCount).integer().not_null())
                    .to_owned(),
            )
            .await?;

        // Events table
        manager
            .create_table(
                Table::create()
                    .table(Event::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Event::Id).string().not_null().primary_key())
                    .col(ColumnDef::new(Event::Name).string().not_null())
                    .col(ColumnDef::new(Event::CreatedAt).timestamp().not_null())
                    .col(ColumnDef::new(Event::VisitedAt).timestamp().not_null())
                    .col(ColumnDef::new(Event::Times).json().not_null())
                    .col(ColumnDef::new(Event::Timezone).string().not_null())
                    .to_owned(),
            )
            .await?;

        // People table
        manager
            .create_table(
                Table::create()
                    .table(Person::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Person::Name).string().not_null())
                    .col(ColumnDef::new(Person::PasswordHash).string())
                    .col(ColumnDef::new(Person::CreatedAt).timestamp().not_null())
                    .col(ColumnDef::new(Person::Availability).json().not_null())
                    .col(ColumnDef::new(Person::EventId).string().not_null())
                    .primary_key(Index::create().col(Person::EventId).col(Person::Name))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_person_event")
                            .from(Person::Table, Person::EventId)
                            .to(Event::Table, Event::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            )
            .await?;

        println!(" done");
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Stats::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Person::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Event::Table).to_owned())
            .await?;

        Ok(())
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum Stats {
    Table,
    Id,
    EventCount,
    PersonCount,
}

#[derive(Iden)]
enum Event {
    Table,
    Id,
    Name,
    CreatedAt,
    VisitedAt,
    Times,
    Timezone,
}

#[derive(Iden)]
enum Person {
    Table,
    Name,
    PasswordHash,
    CreatedAt,
    Availability,
    EventId,
}
