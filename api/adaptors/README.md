# Crab Fit Storage Adaptors

This directory contains sub-crates that connect Crab Fit to a database of some sort. For a list of available adaptors, see the [api readme](../README.md).

## Adding an adaptor

The suggested flow is copying an existing adaptor, such as `memory`, and altering the code to work with your chosen database.

Note, you will need to have the following crates as dependencies in your adaptor:

- `common`<br>Includes a trait for implementing your adaptor, as well as structs your adaptor needs to return.
- `async-trait`<br>Required because the trait from `common` uses async functions, make sure you include `#[async_trait]` above your trait implementation.
- `chrono`<br>Required to deal with dates in the common structs and trait function signatures.

Once you've created the adaptor, you'll need to make sure it's included as a dependency in the root [`Cargo.toml`](../Cargo.toml), and add a feature flag with the same name. Make sure you also document the new adaptor in the [api readme](../README.md).

Finally, add a new version of the `create_adaptor` function in the [`adaptors.rs`](../src/adaptors.rs) file that will only compile if the specific feature flag you added is set. Don't forget to add a `not` version of the feature to the default memory adaptor function at the bottom of the file.

## FAQ

Why is it spelt "adaptor" and not "adapter"?
> The maintainer lives in Australia, where it's usually spelt "adaptor" 😎
