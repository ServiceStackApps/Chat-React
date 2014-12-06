React Chat
==========

is a port of [ServiceStack Chat](https://github.com/ServiceStackApps/Chat) Server Events demo into React.js Application using [ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) new ReactJS Single Page App VS.NET Template which enables a modern approach for developing rich React.js Apps in .NET.

[![React Chat](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react.png)](http://react-chat.servicestack.net)

> Live Demo: http://react-chat.servicestack.net

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

Fast dev iterations is one of the nicest benefits of developing Single Page Apps where because you're editing the same plain text files the browsers execute they're instantly view-able after a quick refresh cycle (i.e. without needing to wait for your .NET Web Server to restart). This fast dev cycle also extends to [ServiceStack Razor](http://razor.servicestack.net/) which supports live-reloading where modified `.cshtml` Razor Views are also view-able on-the-fly without an AppDomain restart.

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

[React](http://facebook.github.io/react/) is a new library from Facebook that enables a new approach to rendering dynamic UI's, maintaining state and modularizing large complex JavaScript Apps. 

Rather than attempting to be a full-fledged MVC framework, React is limited in scope around the **V** in **MVC** and can even be used as a high-performance view renderer together with larger MVC frameworks.

React benefits from its limited focus by having a simple but functionally capable API with a small surface area requiring very few concepts to learn - essentially centered around everything being a Component. Conceptually speaking React Components are similar to [Custom Elements](https://www.polymer-project.org/platform/custom-elements.html) in [Web Components](http://webcomponents.org/) where they encapsulate presentation, state and behavior and are easily composable using in an XML-like syntax (JSX) or JavaScript (when preferred).

### Simple One-Way Data Binding

In contrast to [AngularJS](https://angularjs.org) which popularized 2-way data-binding for the web, React offers a controlled one-way data flow that encourages composing your app into modular components that are declaratively designed to reflect how they should look at any point in time. 

Whilst on the surface this may not appear as useful as a traditional 2-way data-binding system, it ends up being easier to reason-about as instead of having to think about effects of changes to your running App, your focus is instead on how your App should look like for a particular given state.

### Virtual DOM

To change the UI, you just update a components state and React will conceptually re-render the entire app so that it reflects the new state. Whilst this may sound inefficient, React's clever use of a Virtual DOM to capture a snapshot of your UI and its diff algorithm ensures that only the DOM elements that needs updating are changed - resulting in a high-performance and responsive UI.

### Simple, Declarative, Modular Components

Components are at the core of React, they're the primary way to encapsulate a modular unit of functionality in React which can be composed together like a Custom HTML Elements. 

A component is simply a **React class** that implements a `render` method returning how it should look. As they're just lightweight JS classes they're suitable for encapsulating any level of granularity from a single HTML element:

```js
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

to  React Chat's entire application, which is itself further comprised of other Components:

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

The mapping is a simple transformation enabled with Facebook's JSX JavaScript syntax extension which lets you use an XML-like syntax to define JS object graphs where our earlier `<HelloMessage/>` React component:

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

> React's convention is to use **lowercase** names to reference HTML elements and **PascalCase** names to reference React components, which affects how the JSX is transpiled.

From this we can see that JSX just compiles to a nested graph of JS function calls. Knowing this we can see how to write components in plain JavaScript directly, without JSX. Whilst this is indeed possible, JSX is still preferred because it has a familiar HTML-like syntax whose attributes and elements provide a more concise and readable form than the equivalent nested JavaScript function calls and object literals.

### Virtual DOM vs HTML

Its close appearance to HTML may mistakenly give the impression that it also behaves like HTML, but as its instead a representation of JavaScript, it does have some subtle differences to be aware of.

The modified `HelloMessage` component below illustrates some of the key differences:

```js
var HelloMessage = React.createClass({
  handleClick: function(event) {
      //...
  },
  render: function() {
    return (
        <div className="hello" style={{marginLeft:10}} onClick={this.handleClick}>
            Hello {this.props.name}
        </div>
    );
});
```

Firstly JavaScript keywords such as `class` and `for` are discouraged, instead, React DOM components expect DOM property names like `className` and `htmlFor`, respectively.

Next `style` accepts a JavaScript object literal for which styles to set, and like component attributes it expects identifiers to be in JS camelCase like `marginLeft` instead of CSS's `margin-left`.  There are a [few exceptions](http://facebook.github.io/react/tips/style-props-value-px.html), but in most cases integer values get converted into `px` e.g. `10px`.

The `{}` braces denotes a JavaScript expression, so when double braces are used, i.e: 

    { {marginLeft:10} }
    
It just denotes a JavaScript expression that returns the `{marginLeft:10}` object literal.

Unlike HTML which have string attributes, Component attributes can be assigned any JavaScript object which is how `onClick` can be assigned a reference to the `this.handleClick` method directly.

### Synthetic Events

The other difference of `onClick` is that it uses a [Synthetic Event](http://facebook.github.io/react/docs/events.html) system which mimics (and wraps) a native browser event, but uses a virtual implementation that's behaves consistently across all browsers. 

Like other attributes, event attributes are exposed using a JS camelCase convention starting with `on` so instead of `click` you would instead use `onClick`. By default event handlers are triggered in the bubbling phase and can be instead be registered to trigger in the capture phase by appending `Capture` to the event name, e.g: `onClickCapture`.

## Porting an application to React.js

Porting [Chat](https://github.com/ServiceStackApps/Chat) to a React-based app highlights the differences and benefits of a React-based app over vanilla JavaScript or jQuery app like Chat.

### Modularity vs Lines of Code

As far as web apps go, Chat does an impressive job of implementing the [core features of a chat application](https://github.com/ServiceStackApps/Chat#chat) in just **170 lines of JavaScript**, it's able to achieve this by leveraging a number of features in ss-utils.js like [Declarative Events](https://github.com/ServiceStack/ServiceStack/wiki/ss-utils.js-JavaScript-Client-Library#declarative-events) eliminating the boilerplate involved with book-keeping, firing and handling DOM events. 

Sometimes rewriting your app to use a framework will result in a net savings in lines of code, typically due to replacing redundant code and bespoke implementations with in-built framework features, but in this case as there was no boilerplate or repetitive, the lines of HTML and JS ended up doubling. 

This increase in code is effectively the price paid for modularity. The original Chat is essentially a monolithic app developed as a [single intertwined block of HTML + JS](https://github.com/ServiceStackApps/Chat/blob/master/src/Chat/default.cshtml) where the entire app is the smallest logic of unit. The result of this means that impact of change has the potential to affect any part of the App so the entire context of the App needs to be kept into consideration with every change. 

There's also limited potential for re-use, i.e. you couldn't realistically copy a code fragment in isolation and re-use it as-is inside another App. Whilst this is manageable (and requires less effort) in small code bases, it doesn't scale well with a larger and constantly evolving code-base.

### React Components

The first step into creating a React app is deciding how to structure the app, as components in React are really lightweight, the number of components shouldn't affect the granularity of how to partition your app as you can happily opt for the most logical separation that suits your needs.

For Chat, this was easy as the app was already visually separated into distinct components, which is what dictated how it was restructured into different components:

![Chat Components](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-components.png)

- [Header.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/Header.jsx)
- [ChatLog.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/ChatLog.jsx)
- [Sidebar.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/Sidebar.jsx)
- [Footer.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/Footer.jsx)

As well as a top-level `ChatApp` component to glue the different components together:

- [ChatApp.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/ChatApp.jsx)

The first step in porting to React is getting the layout and structure right, so for the first pass just the HTML markup was copied over, e.g. the initial cut of [Footer.jsx](https://github.com/ServiceStackApps/Chat-React/blob/master/src/ChatReact/ChatReact/js/components/Footer.jsx) without any behavior looked like:

```js
var Footer = React.createClass({
    render: function() {
        return (
            <div id="bottom">
                <input ref="txtMsg" id="txtMsg" type="text" />
                <button id="btnSend" style={{marginLeft: 5}}>Send</button>
            </div>
        );
    }
});
```

React supports this gradual dev workflow quite nicely where the design of the App is instantly viewable after extracting the HTML markup into its distinct components. 

### State and Communications between Components

The important concept to keep in mind when reasoning about React's design is that components are a projection for a given State. To enforce this data flows unidirectionally down from the top-most Component (Owner) to its children via properties. In addition to properties each Component can also maintain its own state and together is what's used to render the UI, dynamically on each state change.

```js
var Sidebar = React.createClass({
    getInitialState: function() {
        return { hideExamples: false };
    },
    toggleExamples: function(e) {
        e.preventDefault();
        this.setState({ hideExamples: !this.state.hideExamples });
    },  
    render: function() {
        var height = this.state.hideExamples ? '25px' : 'auto',
            label = this.state.hideExamples ? 'show' : 'hide';
        return (
            <div id="right">
                <div id="users">
                {this.props.users.map(function(user) { 
                    return <User key={user.userId} user={user} />;
                })}
                </div>
                <div id="examples" style={{ height: height }}>
                    <span onClick={this.toggleExamples}>{label}</span>
                    <span data-click="sendCommand">...</span>
                </div>
            </div>
        );
    }
});
```

```js
var User = React.createClass({
    privateMsg: function(e) {
        Actions.setText("@" + e.target.innerHTML + " ");
    },
    render: function() {
        return ( 
            <div className="user">
                <img src={this.props.user.profileUrl || "/img/no-profile64.png"}/>
                <span onClick={this.privateMsg}>
                    {this.props.user.displayName}
                </span>
            </div>
        );
    }
});
```