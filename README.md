hueadm - Phillips Hue Admin CLI Utility
========================================

A command line management interface to [phillips hue](http://meethue.com)

Installation
------------

First, install [Node.js](http://nodejs.org), then:

    npm install -g hueadm

...and the executable will be installed globally as `hueadm`

How To
------

TODO

Usage
-----

    $ hueadm -h
    A command line management interface to phillips hue

    Usage:
        hueadm [OPTIONS] COMMAND [ARGS...]
        hueadm help COMMAND

    Options:
        -c CONFIG, --config=CONFIG  config file - defaults to ~/.hueadm.json.
        -d, --debug                 enable debug logging.
        -H HOST, --host=HOST        host address of the hue bridge.
        -h, --help                  print this help message and exit.
        -U USER, --user=USER        username associated with the hue bridge.
        -u, --updates               check npm for available updates.
        -v, --version               print the version number and exit.

    Commands:
      General:
        discover (search)  Search for Hue bridges

      Lights:
        lights          List all lights
        light           Show/set a light
        search-lights   Search for new lights
        new-lights      Show new lights
        rename-light    Rename a light
        delete-light    Delete a light

      Groups:
        groups          List all light groups
        group           Show/set a light group
        create-group    Create a light group
        modify-group    Modify a light group
        delete-group    Delete a light group

      Schedules:
        schedules       List all schedules
        schedule        Show a schedule
        create-schedule  Create a schedule
        modify-schedule  Modify a schedule
        delete-schedule  Delete a schedule

      Scenes:
        scenes          List all scenes
        scene           Show a scene
        create-scene    Create a scene
        modify-scene    Modify a scene
        delete-scene    Delete a scene

      Sensors:
        sensors         List all sensors
        sensor          Show a sensor
        create-sensor   Create a sensor
        rename-sensor   Rename a sensor
        delete-sensor   Delete a sensor

      Rules:
        rules           List all rules
        rule            Show a rule
        create-rule     Create a rule
        modify-rule     Modify a rule
        delete-rule     Delete a rule

      Users:
        users           List all users
        user            Show a user
        create-user (register)  Create/register a new user
        delete-user     Delete a user

      Other Commands:
        config          Show the hue bridge config
        full-state      Show the hue bridge fullstate
        request         Make a raw HTTP request

      Generic Commands:
        help (?)        Help on a specific sub-command.

License
-------

MIT
