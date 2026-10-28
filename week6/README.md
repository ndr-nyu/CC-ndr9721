## Week 6 Notes

I had a lot of fun (and frustrations) building this clock. The time functions used are seconds, minutes and hours. Pac-man eats a dot every second. Every minute, he eats a cherry and is hit by a ghost. Every hour, four ghosts come for Pac-man, but he triggers 'scared-ghost mode' and they disperse away in different directions. The LLM helped me build complex shapes and functions. I did a lot of testing and debugging throughout this process. Overall, I am happy with the results, but there were a couple things I couldn't fix: 

  1. The self-generating dot path has a tendency to box itself in and backtrack over already drawn dots. I experimented with lots of ways to fix this, but each attempt would break my code. One idea I had was to generate a portal in the location where the dots box themselves in. The portal exit would be generated in another area of the screen with a lot of open space. The dot path would continue through the exit portal and Pac-man would transport in between portals when he arrived at them. Unfortunately, this idea kept failing so I reverted back to my previous code.

  2. I also tried to bring in some custom Pac-man font I downloaded, but this kept failing as well. I eventually decided to use a retro arcade google font that worked great.

  

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
