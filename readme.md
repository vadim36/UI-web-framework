# 🏆 Web UI Framework
## Install

### ❗Warning, this is a practice project, no a true library💥

Complete with Parcel Bundler✨
```
npm i -D typescript
===================
npm run build
```
## Usage
Import of Single Component
```js
import { Tabs } from './components/Tabs'
```
Import of Full Component
```js
require('components')
```
Creating of new Component🔥
```js
new <Component_Name>(<DOM_Element>, <Component_Objects>);

//Example
const $element = document.querySelector('.card-tab');
new Tabs($element, {
  size: ElementSize.Primary, //You can point size only of this object "ElementSize"
})
```

## Components of this this framework👍
* ✅ Wave button
  * Simple Button with cool animation🌊
  * ```js
    new WaveButton(<DOM_ELEMENT>, {
      size
    })
    ```
* ✅ Menu Hamburger
  * Simple Menu Hamburger with cool Animations👾 and possibility add open aside menu😲
  * ```js
    new MenuHamburger(<DOM_ELEMENT>, {
      size,
      animationIndex<number>, //animation of toggle menu
      //Optional
      $asideElement<DOM_ELEMENT>
    })
    ```
* ✅ Tabs
  * Simple Expandeble Tabs Component📑
  * ```js
    new Tabs(<DOM_ELEMENT>, {
      size,
      tabs: [
        {
          tabName,
          tabContent,
          isCurrent
        }
      ]
    })
    ```
* ✅Dropdown
  * Simple Dropdown Menu☔
  * ```js
    new Dropdown(<DOM_ELEMENT>, {
      size,
      additionalStyles,
      dropdownItem
    })
    ```