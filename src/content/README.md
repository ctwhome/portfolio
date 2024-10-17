# Instructions for the posts

frontmatter variables:
```yaml
published: true
title: Blog 1
description: A description here
date: 2024-01-01
coverImage: image.avif
displayCover: true  # False to only show the cover in the list
tags:
  - tag 1
  - tag 2

# layout: default || custom
type: blog
```

## Very important notes

> The images NEED to be inside the `./images/` folder to work
```
![Alt text](./images/image.avif)
```

> All image name MUST be unique!
> The cover image has a aspect ratio of 16:9


## Images with captions

```markdown
<figure>
 <img src="./images/revolution.avif" alt="A descriptive alt text">
    <figcaption>
    The 19th-century Industrial Revolution birthed factories and specialized workers.
    </figcaption>
</figure>
```