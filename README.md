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
The incoming request is first passed to the [parser](https://github.com/barathvk/routes/blob/master/router/parser.js) class. This class breaks down the URL and HTTP method into its constituent parts. No schema validation is performed atthis stage.

The parsed object is then passed onto the [router](https://github.com/barathvk/routes/blob/master/router/index.js) class. The router is initialized with a schema object. An example schema can be seen (here)[https://github.com/barathvk/routes/blob/master/ui/js/todoshema.json]. The schema is validated against certain rules through (Joi) [https://github.com/hapijs/joi]. The router then further looks for paramters to substitute and any data that may be required. A fully parsed object is then returned back to the application to handle as the application sees fit.

# User Interface
The user interface uses the above router to demonstrate the creation of a schema, manipulating routes, adn testing the routes. The user interface also has a sample Todo List application to demonstrate the usage of routes.

For more information on the user interface please see the [wiki](https://github.com/barathvk/routes/wiki)
