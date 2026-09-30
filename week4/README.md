# week4 Notes

This week’s creative coding assignment was a fun challenge. I used inspiration from my last week’s “waves” generative iteration, using the same 2D for loops to create an alternating triangular pattern. In this iteration, I applied a slight rotation to the triangles as they transition down the y-axis. For my interactive element, I applied hatches with a noise variable to randomly generate new patterns with each click. For this feature, I messed around with it a lot because it bothered me that the hatches weren’t confined to the outlines of the triangles. When I tried to modify this, the hatches themselves looked a lot different. I tried troubleshooting to keep the hatches looking exactly the same, but just trimmed at the triangle edge. After awhile of testing out different code, I reverted back to the original code for the hatches. I may try to fix this feature next week for the final pen plotter iteration.

Using the pen plotter itself was a relatively smooth process. I produced two different plots — the first was one single color and the second had two colors offset from one another. The plotter took about 15 minutes to render my drawing one time because there are so many lines. When producing the offset render, I offset the other color a lot more than I had intended. It still looks cool but I will probably try to do less of an offset next time. The triangle lines are also a lot less crisp when rendered on the pen plotter even though I smoothed out the paper as much as I could. Is this just inevitable when using the pen plotter? Or is it partially due to my choice of using markers?


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
