hueadm - Phillips Hue Admin CLI Utility
========================================

A command line management interface to [phillips hue](http://meethue.com)

Installation
------------

First, install [Node.js](http://nodejs.org), then:

    npm install -g hueadm

...and the executable will be installed globally as `hueadm`

Getting Started
---------------

### Setup

#### Find a bridge

To get started you must find the IP address of the Hue bridge you would like to
manage.  If you know the IP address or the hostname of the bridge you would
like to manage you can skip this step.

    $ hueadm search
    IP
    10.0.1.80

On my network `10.0.1.80` is the IP of the bridge I'll be controlling.

#### Register a user

Now that we have the IP of the bridge we want to control, we can now create a
new account for the `hueadm` tool to use.

    $ hueadm -H 10.0.1.80 register dave
    sending request... press the link button on the hue bridge

Now, go to the bridge and press the physical button on it to complete the
registration - you'll see a message like this:

    $ hueadm -H 10.0.1.80 register dave
    sending request... press the link button on the hue bridge
    -
        success: {username: f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt}

That very long string is the username we'll be using for all requests going
forward.  Using the `lights` subcommand we can get a list of all lights on the
bridge to verify the new user account is working.

    $ hueadm -H 10.0.1.80 -U f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt lights
    ID  NAME                       STATUS  BRIGHTNESS  REACHABLE
    1   Nightstand                 on      254         true
    2   Garage Right               on      254         false
    3   Garage Left                on      254         false
    4   Pool House                 on      254         true
    5   Garage Side Door           on      254         true
    6   Garage Back                on      254         true
    7   Front Door                 on      254         true
    8   Screen Room Right          on      254         true
    12  Couch                      on      254         true
    13  Street Left                on      254         false
    14  Pool House Back            on      254         true
    15  Test Light 1               on      254         true
    16  Driveway                   on      254         false
    20  Inside Garage Front Left   off     250         false
    21  Inside Garage Front Right  off     250         true
    22  Inside Garage Back Right   off     250         false
    23  Inside Garage Back Left    off     2           false
    24  Screen Room Left           on      254         false
    25  Inside Screen Room Left    on      254         true
    26  Courtyard Back             on      254         false
    27  Front Yard                 on      254         false
    28  Hue color light 1          on      254         false

#### Create a config

Instead of passing `-H` and `-U` for every request, we can create a config file
for `hueadm` to use if those arguments are not specified.

    $ vim ~/.hueadm.json
    $ cat ~/.hueadm.json
    {
        "user": "f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt",
        "host": "10.0.1.80"
    }

### Lights

#### Get light information

Now, we can run the same command like:

    $ hueadm lights
    ID  NAME                       STATUS  BRIGHTNESS  REACHABLE
    1   Nightstand                 on      254         true
    2   Garage Right               on      254         false
    ... snipped ...

To get information about a specific light:

    $ hueadm light 15
    state:
        on: true
        bri: 254
        hue: 14988
        sat: 141
        effect: none
        xy: [0.4575, 0.4101]
        ct: 366
        alert: select
        colormode: xy
        reachable: true
    type: 'Extended color light'
    name: 'Test Light 1'
    modelid: LCT001
    manufacturername: Philips
    uniqueid: 'removed'
    swversion: 5.50.1.19085

All subcommands allow for `-j` or `--json` to be specified to force the output
to be JSON.

    $ hueadm light -j 15
    {
      "state": {
        "on": true,
        "bri": 254,
        "hue": 14988,
        "sat": 141,
        "effect": "none",
        "xy": [
          0.4575,
          0.4101
        ],
        "ct": 366,
        "alert": "select",
        "colormode": "xy",
        "reachable": true
      },
      "type": "Extended color light",
      "name": "Test Light 1",
      "modelid": "LCT001",
      "manufacturername": "Philips",
      "uniqueid": "removed",
      "swversion": "5.50.1.19085"
    }

#### Setting light state

Using the same `light` subcommand, the state can be set.  There are a lot of
different ways to change the state of the lights.

- `on`: turn the light on
- `off`: turn the light off
- `reset`: clear any and all effects on a light
- `select`: flash the light once
- `lselect`: flash the light for 15 seconds (can be cancelled with reset)
- `colorloop`: enable the color loop effect
- `-`: read state JSON object from stdin
- `[0-9]+K`: set the light to a color based on Kelvin. ie. `2700K`, `5000k`, etc.
- `<colorname>`: set the light to a color name (using CSS color names). ie. `blue`, `red`, `magenta`
- `#012345`: set the light to any hex string (`#` is optional)

Turn a light on or off

    $ hueadm light 15 off
    -
        success: {/lights/15/state/on: false}
    $ hueadm light 15 on
    -
        success: {/lights/15/state/on: true}

Again, `-j` works here too

    $ hueadm light 15 -j off
    [
      {
        "success": {
          "/lights/15/state/on": false
        }
      }
    ]

Set a light to green (this will turn it on if it was previously off)

    $ hueadm light 15 green
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/hue: 21845}
    -
        success: {/lights/15/state/sat: 254}
    -
        success: {/lights/15/state/bri: 64}

Any extra arguments will be processed as key=value pairs, and added to the
request sent to the bridge.  This way, it is possible to set multiple
attributes of a light in a single command.

Set the light to green with the brightness set to max.

    $ hueadm light 15 green bri=255
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/hue: 21845}
    -
        success: {/lights/15/state/sat: 254}
    -
        success: {/lights/15/state/bri: 254}

Change the light to red and take 5 seconds for the transition to happen.
`transitiontime` is given in 100's of milliseconds, so `50` is 5 seconds.

    $ hueadm light 15 red bri=127 transitiontime=50
    -
        success: {/lights/15/state/transitiontime: 50}
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/hue: 0}
    -
        success: {/lights/15/state/sat: 254}
    -
        success: {/lights/15/state/bri: 127}

Read light state from stdin as JSON.

    $ echo '{"on": true}' | hueadm light 15 -
    -
        success: {/lights/15/state/on: true}

Set the light color using a hex string

    $ hueadm light 15 '#00ff00'
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/hue: 21845}
    -
        success: {/lights/15/state/sat: 254}
    -
        success: {/lights/15/state/bri: 127}

Set the light to a standard "Warm White" color (similar to an incandescent bulb)

    $ hueadm light 15 2700k
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/ct: 370}

Enable the color loop effect

    $ hueadm light 15 colorloop
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/effect: colorloop}

Clear the color loop (and any other) effect

    $ hueadm light 15 reset
    -
        success: {/lights/15/state/on: true}
    -
        success: {/lights/15/state/alert: none}
    -
        success: {/lights/15/state/effect: none}

#### Modify a light

Using the `lights` subcommand, it is also possible to filter for a specific ID
to get a short synopsis of the light state.

    $ hueadm lights id=15
    ID  NAME          STATUS  BRIGHTNESS  REACHABLE
    15  Test Light 1  on      127         true

Rename the light to `foobar`

    $ hueadm rename-light 15 'foobar'
    -
        success: {/lights/15/name: foobar}

    $ hueadm lights id=15
    ID  NAME    STATUS  BRIGHTNESS  REACHABLE
    15  foobar  on      127         true

### Groups

#### List light groups

In order to control more than 1 light at a time, a group of lights must be
created.  The group can then be controlled the same way a single light is
controlled using `hueadm`.

To list all groups

    $ hueadm groups
    ID  NAME           TYPE  LIGHTS
    3   Garage Inside  Room  20,21,22,23
    4   Outside        Room  2,3,4,5,6,7,8,13,14,15,16,24,25,26,27

Even though it doesn't show it, group `0` always exists on the bridge and
contains every light known.  This group is special and cannot be deleted.

#### Create a light group

To create a light group

    $ hueadm create-group name='Test Group' lights=1,2,3,4
    -
        success: {id: '1'}

The group has been created with the id `1`, we can see it with

    $ hueadm group 1
    name: 'Test Group'
    lights:
    - '1'
    - '2'
    - '3'
    - '4'
    type: LightGroup
    state:
    all_on: true
    any_on: true
    recycle: false
    action:
    on: true
    bri: 254
    hue: 14988
    sat: 141
    effect: none
    xy: [0.4575, 0.4101]
    ct: 365
    alert: select
    colormode: xy

Or in a simpler way with

    $ hueadm groups id=1
    ID  NAME        TYPE        LIGHTS
    1   Test Group  LightGroup  1,2,3,4

#### Modify a group

Any property of the group can be modified with `modify-group`

To rename a group

    $ hueadm modify-group 1 name='Foo Group'
    -
        success: {/groups/1/name: 'Foo Group'}

    $ hueadm groups id=1
    ID  NAME       TYPE        LIGHTS
    1   Foo Group  LightGroup  1,2,3,4

To change the lights in a group

    $ hueadm modify-group 1 lights=5,6,7,8
    -
        success: {/groups/1/lights: ['5', '6', '7', '8']}

    $ hueadm groups id=1
    ID  NAME       TYPE        LIGHTS
    1   Foo Group  LightGroup  5,6,7,8

#### Set a group state

All state modifications to a single light can be used to modify a group as well

Kelvin

    $ hueadm group 1 2700k
    -
        success: {/groups/1/action/on: true}
    -
        success: {/groups/1/action/ct: 370}

Color and brightness

    $ hueadm group 1 red bri=255
    -
        success: {/groups/1/action/on: true}
    -
        success: {/groups/1/action/bri: 254}
    -
        success: {/groups/1/action/hue: 0}
    -
        success: {/groups/1/action/sat: 254}

Clear all effects

    $ hueadm group 1 reset
    -
        success: {/groups/1/action/on: true}
    -
        success: {/groups/1/action/alert: none}
    -
        success: {/groups/1/action/effect: none}

#### Delete a group

To delete the group run

    $ hueadm delete-group 1
    -
        success: '/groups/1 deleted'

### Users

#### List users

To list all users on a bridge (I've modified some IDs for privacy reasons)

    $ hueadm users
    ID                                        NAME               CREATION  LASTUSE
    1                                         node-hue-cli       3y        1s
    2                                         hue-cli#dave       2d        11h
    3                                         hue_ios_app#black  1d        21h
    4                                         gohue#papertigers  1w        1w
    f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt  hueadm#dave        11h       1s

#### See a specific user

To see our current username we can do

    $ hueadm users id=f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt
    ID                                        NAME         CREATION  LASTUSE
    f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt  hueadm#dave  11h       2s

Or

    $ hueadm user f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt
    'last use date': '2017-09-04T16:56:26'
    'create date': '2017-09-04T05:51:40'
    name: 'hueadm#dave'

#### Delete a user

To delete our user

    $ hueadm delete-user f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt
    -
        success: '/config/whitelist/f28jfl3gtltQw4r4gKLEtVFsfJcBGE87A1RaAXgt deleted'

**NOTE:** If you do this, you will need to register a new username

### Misc.

#### Config

To get the full bridge config, use:

    $ hueadm config
    name: 'Philips hue'
    zigbeechannel: 20
    ... snipped ...

#### Raw request

To make a raw request to the bridge, use the `request` subcommand.  This will
automatically prepend `/api/<username>` to the endpoint given.

    $ hueadm request /lights/15
    state:
	on: true
	bri: 100
	hue: 14884
	sat: 144
	effect: none
	xy: [0.4597, 0.4103]
	ct: 370
	alert: none
	colormode: ct
	reachable: true
    type: 'Extended color light'
    name: foobar
    modelid: LCT001
    manufacturername: Philips
    uniqueid: 'removed'
    swversion: 5.50.1.19085

Give body as CLI args

    $ hueadm request -j -X PUT /lights/15/state on=true bri=255
    [
      {
	"success": {
	  "/lights/15/state/on": true
	}
      },
      {
	"success": {
	  "/lights/15/state/bri": 254
	}
      }
    ]

Give body as JSON

    $ echo '{"on":true,"bri":255}' | hueadm request -j -X PUT /lights/15/state -
    [
      {
	"success": {
	  "/lights/15/state/on": true
	}
      },
      {
	"success": {
	  "/lights/15/state/bri": 254
	}
      }
    ]

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
