# Simple Router Implementation
The router code can be found in the [router](https://github.com/barathvk/routes/tree/master/router) folder. Tests can be found in the [test](https://github.com/barathvk/routes/tree/master/test) folder.

The router has the following features:
  * Accepts a schema in JSON to build a set of routes
  * Accepts parameterized URLs
  * Allows GET, POST, PUT and DELETE requests
  * Validates incoming requests that contain data against a JSON schema specified in the router schema
  * Returns a parsed object that contains the
    * The original URL
    * The matched URL
    * Path parameters
    * Query parameters
    * Data passed with the request (if any)
    * Content type (application/json or text/plain)
    * Query string
    * Validation schema

## Implementation Details

# User Interface
The user interface uses the above router to demonstrate the creation of a schema, manipulating routes, adn testing the routes. The user interface also has a sample Todo List application to demonstrate the usage of routes.

For more information on the user interface please see the [wiki](https://github.com/barathvk/routes/wiki)
