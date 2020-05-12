# Lecture 5

## XSS link

```
document.cookie = 'sessionID=1234'
```

`http://localhost:3000/?source=<script>alert(document.cookie)</script>`

### data: links

`data:text/html,<script>alert('test')</script>`

### javascript: links

`javascript:alert('test')`
