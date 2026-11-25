# Final Proposal Write-Up
1) I want to revisit the week 10 assignment about sound. I really liked what I created, but there were multiple things I wanted to test out and ran out of time. This would be a great opportunity to try these ideas out.
2) I would like to experiment with a cooler background to my game. There is currently one small disco ball and it would be fun to upgrade this to a new graphic/animation. I also want to add instructions at the beginning so the user is ready to press the keys "a, s, d and f" and play the game. Additionally, I want to experiment with other amplitude graphics behind the screen as the user is playing. Also, I want to extend the game since each song only lasts for about 40 seconds and potentially add more levels/dynamic color changes as the user is playing. Finally, I want to test out if there are ways to better map the keys to the rhythm of the song.
3) Some thoughts on how I could accomplish this include testing out commands such as sin and cos to create a dynamic background. I could also experiment with rotating the disco ball, changing it's scale and potentially adding multiple disco balls to the background. Additionally, I want to add a "tutorial" state to the beginning of game that shows the keys "a, s, d and f" drawn in boxes. These tutorial keys could light up in as the player presses them. Next, I could test out 2-3 amplitude visualizers such as a wave, bars and another frequency rings animation. To extend the song play, I will adjust the trackData variable so the game will last for the entire length of all the songs. To create level changes, I can test out shifting the color palette with commands such as lerpColor.

I expect to run into challenges while implementing all the commands above. I think I will face the most challenge with mapping out the keys to the ryhthm (I don't know if this is something I would have to do manually to get the result I want or if I can work with the FFT peak detection to accomplish this). I also expect to run into challenges fine-tuning the amplitude visualizer graphics since this was something I experimented with last week and had some difficultly with.

Please check the media folder for some inspiration on audio visualizers and updated disco ball backgrounds.



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
