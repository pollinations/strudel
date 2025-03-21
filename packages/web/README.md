# @strudel/web

This package provides an easy to use bundle of multiple strudel packages for the web.

## Usage

Save this code as a `.html` file and double click it:

```html
<!DOCTYPE html>
<button id="play">play</button>
<button id="stop">stop</button>
<script type="module">
  import { initStrudel } from 'https://cdn.skypack.dev/@strudel/web@0.8.2';

  initStrudel();
  document.getElementById('play').addEventListener('click', () => note('<c a f e>(3,8)').play());
  document.getElementById('stop').addEventListener('click', () => hush());
</script>
```

With the help of [skypack](https://www.skypack.dev/), you don't need a bundler nor a server.

As soon as you call `initStrudel()`, all strudel functions are made available.
In this case, we are using the `note` function to create a pattern.
To actually play the pattern, you have to append `.play()` to the end.

Note: Due to the [Autoplay policy](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices#autoplay_policy), you can only play audio in a browser after a click event.

### Via npm

If you're using a bundler, you can install the package via `npm i @strudel/web`, then just import it like:

```js
import { initStrudel } from '@strudel/web';
```

The rest of the code should be the same. Check out [vite](https://vitejs.dev/) for a good bundler / dev server.

### Loading samples

By default, no external samples are loaded, but you can add them like this:

```js
initStrudel({
  prebake: () => samples('github:tidalcycles/Dirt-Samples/master'),
});

document.getElementById('play').addEventListener('click', 
  () => s("bd sd").play()
)
```

You can learn [more about the `samples` function here](https://strudel.tidalcycles.org/learn/samples#loading-custom-samples).

### Evaluating Code

Instead of creating patterns directly in JS, you might also want to take in user input and turn that into a pattern.
This is called evaluation: Taking a piece of code and executing it on the fly.

To do that, you can use the `evaluate` function:

```js
initStrudel();
document.getElementById('play').addEventListener('click', 
  () => evaluate('note("c a f e").jux(rev)')
);
document.getElementById('play').addEventListener('stop', 
  () => hush()
);
```

### Double vs Single Quotes

There is a tiny difference between the [Strudel REPL](https://strudel.tidalcycles.org/) and `@strudel/web`.
In the REPL you can use 'single quotes' for regular JS strings and "double quotes" for mini notation patterns.
In `@strudel/web`, it does not matter which types of quotes you're using.
There will probably be an escapte hatch for that in the future.

## More Examples

Check out the examples folder for more examples, both using plain html and vite!