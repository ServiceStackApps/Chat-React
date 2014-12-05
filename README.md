React Chat
==========

is a port of [ServiceStack Chat](https://github.com/ServiceStackApps/Chat) Server Events demo into React.js Application using [ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) new ReactJS Single Page App VS.NET Template which enables a modern approach for developing rich React.js Apps in .NET.

![React Chat](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react.png)

## Modern Single Page Apps with .NET 

The ServiceStackVS **ReactJS App** template shares the same modern approach as the [AngularJS App](https://github.com/ServiceStack/ServiceStackVS/blob/master/angular-spa.md) template highlighting our recommended approach for building modern Single Page Apps in .NET by leveraging the **node.js** ecosystem for managing all Client App development using the best-in-class libraries below:

 - [npm](https://www.npmjs.org/) to manage node.js dependencies (bower, grunt, gulp)
 - [Bower](http://bower.io/) for managing client dependencies (angular, jquery, bootstrap, etc)
 - [Grunt](http://gruntjs.com/) as the primary task runner for server, client packaging and deployments
 - [Gulp](http://gulpjs.com/) used by Grunt to do the heavy-lifting bundling and minification

The ServiceStackVS VS.NET templates conveniently pre-configures all the above libraries into a working out-of-the-box App, it also includes high-level grunt tasks to take care of the full-dev-cycle of building, packaging and deploying your app:

 - **[01-run-tests](https://github.com/ServiceStack/ServiceStackVS/blob/angular-spa-template/angular-spa.md#01-run-tests)** - Runs Karma JavaScript Unit Tests
 - **[02-package-server](https://github.com/ServiceStack/ServiceStackVS/blob/angular-spa-template/angular-spa.md#02-package-server)** - Uses msbuild to build the application and copies server artefacts to `/wwwroot`
 - **[03-package-client](https://github.com/ServiceStack/ServiceStackVS/blob/angular-spa-template/angular-spa.md#03-package-client)** - Optimizes and packages the client artefacts for deployment in `/wwwroot`
 - **[04-deploy-app](https://github.com/ServiceStack/ServiceStackVS/blob/angular-spa-template/angular-spa.md#04-deploy-app)** - Uses MS WebDeploy and `/wwwroot_buld/publish/config.json` to deploy app to specified server

## Optimal Development and Deployment workflow

The Gulp/Grunt build system takes a non-invasive approach that works around normal web dev practices of referencing external css, js files letting you develop like you would a normal static html website where making changes to any html, js or css files are instantly visible after every refresh. 

Then to package your app for optimal deployment at production, Gulp's [useref](
https://www.npmjs.org/package/gulp-useref) plugin lets you annotate existing references with the bundled and minified file of your choice. This is ideal as the existing external references (and their ordering) remains the master authority on how the app gets optimized for deployment, reducing the maintenance and friction required in developing and packaging an optimized Web App.

We can look at all of React Chat's dependencies to see what this looks like:

```html
<!--build:css css/app.min.css-->
<link rel="stylesheet" href="css/app.css" />
<!-- endbuild -->
<!-- build:js lib/js/jquery.min.js -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<!-- endbuild -->
<!-- build:js lib/js/react.min.js -->
<script src="bower_components/react/react.js"></script>
<!-- endbuild -->
<!-- build:js lib/js/reflux.min.js -->
<script src="bower_components/reflux/dist/reflux.js"></script>
<!-- endbuild -->
<!-- build:remove -->
<script src="bower_components/react/JSXTransformer.js"></script>
<!-- endbuild -->
<script src="js/ss-utils.js"></script>
...
<!-- build:js js/app.jsx.js -->
<script type="text/jsx" src="js/components/Actions.js"></script>
<script type="text/jsx" src="js/components/User.jsx"></script>
<script type="text/jsx" src="js/components/Header.jsx"></script>
<script type="text/jsx" src="js/components/Sidebar.jsx"></script>
<script type="text/jsx" src="js/components/ChatLog.jsx"></script>
<script type="text/jsx" src="js/components/Footer.jsx"></script>
<script type="text/jsx" src="js/components/ChatApp.jsx"></script>
<!-- endbuild -->
```

At development time the HTML comments are ignored and React Chat runs like a normal static html website. Then when packaging the client app before deployment (by running the `03-package-client` task), the build annotations instructs Gulp.js on how to package and optimize the app for deployment to production.

Each build instruction can span one or multiple references of the same type and optionally specify the target filename it should write the compressed and minified output to.

### Design-time only resources

Gulp also handles design-time vs run-time dependencies with the `build:remove` build task which can be used to remove any unnecessary dependencies not required at runtime like react's `JSXTransformer.js`:

```html
<!-- build:remove -->
<script src="bower_components/react/JSXTransformer.js"></script>
<!-- endbuild -->
```

React's `JSXTransformer.js` is what enables the ideal experience of directly referencing and compiling `.jsx` files in the browser at runtime - avoiding any manual pre-compilation steps and retaining the instant `F5` iterative dev workflow. 

```html
<!-- build:js js/app.jsx.js -->
<script type="text/jsx" src="js/components/Actions.js"></script>
<script type="text/jsx" src="js/components/User.jsx"></script>
<script type="text/jsx" src="js/components/Header.jsx"></script>
<script type="text/jsx" src="js/components/Sidebar.jsx"></script>
<script type="text/jsx" src="js/components/ChatLog.jsx"></script>
<script type="text/jsx" src="js/components/Footer.jsx"></script>
<script type="text/jsx" src="js/components/ChatApp.jsx"></script>
<!-- endbuild -->
```

Then when the client app is packaged all `.jsx` files are compiled and minified into a single `/js/app.jsx.js` file where it no longer requires `JSXTransformer.js` to compile the `.jsx` files at runtime.

## Introducing React.js

[React](http://facebook.github.io/react/) is a new library from Facebook that enables a new approach to rendering dynamic UI's, maintaining state as well as modularizing and componentizing large complex JavaScript Apps. 

### Simple One-Way Data Binding

In contrast to [AngularJS](https://angularjs.org) which has popularized 2-way data-binding for the web, React offers a controlled one-way data flow library that encourages composing your app into modular components which are declaratively designed to reflect how it should look at any point in time. 

Whilst on the surface this may not appear as useful as a traditional 2-way data-binding system, it ends up being easier to reason-about as instead of having to think about the effects of changes in your App, your focus is just on how your App should look like for a particular given state.

### Virtual DOM

To change the UI, you just update a components state and React will conceptually re-render the entire app so that it reflects the new state. Whilst this may sound inefficient, React's clever use of a Virtual DOM to capture a snapshot of your UI and its diff algorithm ensures that only the DOM elements that needs updating are changed - resulting in a high-performance and responsive UI.

### Simple, Declarative, Modular Components

Components are at the core of React, they're the primary way to encapsulate a modular unit of functionality in React which can be composed together like a Custom HTML Elements. 

A component is simply a React class that implements a `render` method that returns how it should look. As they're just lightweight JS classes they're suitable for encapsulating any level of granularity from a single HTML element:

```js
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

to  React Chat's entire application, which is itself further comprised of other components, e.g:

```js
var ChatApp = React.createClass({
    //...
    render: function() {
        return (
            <div>
                <Header channel={this.props.channel} 
                        isAuthenticated={this.props.isAuthenticated} 
                        activeSub={this.state.activeSub} />

                <div ref="announce" id="announce">{this.state.announce}</div>
                <div ref="tv" id="tv">{this.state.tvUrl}</div>
                <Sidebar users={this.state.users} />

                <ChatLog ref="chatLog"
                         messages={this.state.messages} 
                         users={this.state.users} 
                         activeSub={this.state.activeSub} />

                <Footer channel={this.props.channel} 
                        users={this.state.users} 
                        activeSub={this.state.activeSub} />
            </div>
        );
    }
});
```

To reference a component, the instance of the React class just needs to be in scope. Once available components can be rendered into the specified DOM element by using `React.render()` API, e.g:

```js
React.render(<HelloMessage name="John" />, document.body);
```

### JSX

Whilst the components above look like they're composing and rendering HTML fragments, they're instead building up a JavaScript node graph representing the Virtual DOM of your application.

The mapping is a simple transformation enabled with Facebooks JSX JavaScript syntax extension which lets you use XML-like syntax to define JS object graphs where our earlier `<HelloMessage/>` React component:

```js
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

Gets transpiled to:

```js
var HelloMessage = React.createClass({displayName: 'HelloMessage',
  render: function() {
    return React.createElement("div", null, "Hello ", this.props.name);
  }
});
```

> React's convention is to use **lowercase** names to reference HTML elements and **CamelCase** names to reference React components, which affects how the JSX is transpiled.

From this we can see that since JSX just compiles to a nested graph of JS functions we can write components without JSX in plain JS directly, whilst this is true JSX is still preferred because it has a familiar HTML-like syntax whose attributes and elements is more concise and readable than the equivalent nested JS function calls and object literals.

### Virtual DOM vs HTML

Its close appearance to HTML may mistakenly give the impression that it also behaves like HTML, but as its instead a representation of JavaScript, as a result does have some subtle differences to be aware of.

The updated HelloMessage component below illustrates some of the differences:

```js
var HelloMessage = React.createClass({
  handleClick: function(event) {
      //...
  },
  render: function() {
    return (
        <div className="hello" style={{marginLeft:10}} onClick={this.handleClick}>
            Hello {this.props.name}
        </div>;
  }
});
```

Firstly JavaScript keywords such as `class` and `for` are discouraged, instead, React DOM components expect DOM property names like `className` and `htmlFor`, respectively.

Next `style` accepts a JavaScript object literal for which styles to set, and like component attributes it expects identifiers to be in JS camelCase like `marginLeft` instead of CSS's `margin-left`.  There are a [few exceptions](http://facebook.github.io/react/tips/style-props-value-px.html), but in most cases integer values get converted into `px` e.g. `10px`.

The `{}` braces denotes a JavaScript expression, so when double braces are used, e.g: `{ {marginLeft:10} }` it denotes a JavaScript expression that returns the `{marginLeft:10}` object literal.

Unlike HTML which have string attributes, Component attributes can be assigned any JavaScript object which is how `onClick` can be assigned a reference to the `this.handleClick` method directly.

### Synthetic Events

The other difference of `onClick` is that it uses a [Synthetic Event](http://facebook.github.io/react/docs/events.html) which mimics (and wraps) a native browser event, but uses a virtual implementation that's behaves consistently across all browsers. 

Like other attributes, event attributes are exposed using a JS camelCase convention starting with `on` so instead of `click` you would need to use `onClick`. By default event handlers are triggered in the bubbling phase and can be instead be registered to trigger in the capture phase by appending `Capture` to the event name, e.g: `onClickCapture`.
 