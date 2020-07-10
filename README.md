# robogo
Keep track of those pesky directionless robots, via WS connection and Vue interface.
Code project for an tech interview.

Notes:

- Works well with < 30 bots at once, at a minimum of 15 ms interval. If the server can handle it, try 200ms x 100 bots. (My laptop choked a little, but was constrained by WS issues.)
- As a general rule, 1ms x num_robots works ok, but I traded ultra-high performance for ease of maintenence and UI.
- Randwalk Go code seems to have issues with multiple sequential WS connections, causing the robots to jump around. Maybe they get shot of robo-caffeine?

## Project setup
```
npm install
```

## Compile and Run code for Fetch testing
```
npm run serve
```
*Make sure the robot WS server is running on :8000*


## Compiles and hot-reloads for development
```
npm run dev
```
