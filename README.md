# Nicole's Creative Coding Repo
## Week 6 Notes

I had a lot of fun (and frustrations) building this clock. The time functions used are seconds, minutes and hours. Pac-man eats a dot every second. Every minute, he eats a cherry and is hit by a ghost. Every hour, four ghosts come for Pac-man, but he triggers 'scared-ghost mode' and they disperse away in different directions. The LLM helped me build complex shapes and functions. I did a lot of testing and debugging throughout this process. Overall, I am happy with the results, but there were a couple things I couldn't fix: 

  1. The self-generating dot path has a tendency to box itself in and backtrack over already drawn dots. I experimented with lots of ways to fix this, but each attempt would break my code. One idea I had was to generate a portal in the location where the dots box themselves in. The portal exit would be generated in another area of the screen with a lot of open space. The dot path would continue through the exit portal and Pac-man would transport in between portals when he arrived at them. Unfortunately, this idea kept failing so I reverted back to my previous code.

  2. I also tried to bring in some custom Pac-man font I downloaded, but this kept failing as well. I eventually decided to use a retro arcade google font that worked great.






```
      <li><a href="./week1/">Week 1 notes</a></li>
      <li><a href="./assignment1/">Assignment 1: Generative Drawing</a></li>
      ...
```
You can simply copy the line above, replacing the directory name with the name of the folder you've just created, and the inner text with a description of the new activity.

---

Markdown Cheatsheet (from [https://www.markdownguide.org/cheat-sheet/](https://www.markdownguide.org/cheat-sheet/)):

---
---

# Heading1
## Heading2
### Heading3
#### Heading4
##### Heading5
###### Heading6

**bold text**

*italicized text*

~~strikethrough text~~

Ordered List:
1. First item
2. Second item
3. Third item

Unordered List:
- First item
- Second item
- Third item

`short code block`

```
extended code block
fun() {
  return 0
}
```

Link:  
[linked text](https://www.example.com)


Image with url:  
![image description](https://dm-gy-6063-2024f-b.github.io/assets/homework/02/clark-espaco-modulado-00.jpg)


Image on repo:  
![image description](./file-name.jpg)


To start a new line, add two spaces at the end of a line, like this:  
this is a new line.


To start a new paragraph, leave an empty line between two lines of text.

This is a new paragraph.
