# Week 9 Notes
For this week's coding assignment, I experimented with hand pose gestural control to manipulate falling shapes on the screen. 

Will you show the body or outline of control points? 
I chose to do both in my sketch. For the "pinch" command, the user will only be seeing their body on the screen activating this. For the "stretch" command, the user will see control points in the form of a cyan line that pops us when they raise both hands to the camera.

What information will you control or change? 
I chose to control whether the shapes are falling or paused with the "pinch" command. Pinching either pauses or plays the falling shapes above. I also chose to control the width and height of the shapes by giving the user control with the "stretch" command. By adjusting the space between your two hands, you can manually change the look of the falling shapes.

How do the gestures and positions you’re tracking map to the experience?
The "pinch" command acts as if the user is pressing a button to pause and play the falling shapes. When the distance between the thumb and index finger drops below 30 pixels, it triggers this variable. The "stretch" command acts as an elastic band, scaling the falling shapes in real time. The cyan line that appears when the user has both hands in the camera view gives them a clear understanding of how their movements are scaling the shapes.



## Getting Started

Open `index.html` in your web browser and start editing `sketch.js`.

## Running Locally

For projects with media files, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

## Resources

- [p5.js 2.0](https://beta.p5js.org/)
- [p5.js Reference](https://p5js.org/reference/)
