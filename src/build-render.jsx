import React from 'react';
import {renderToString} from 'react-dom/server';
import gsap from 'gsap';
import App from './App.jsx';

// Hero preloads are controlled by the page template; avoid duplicate React hints.
export function renderPage(path){return renderToString(<App routePath={path}/>).replace(/<link rel="preload" as="image"[^>]*\/>/g,'')}
export function stopBuildMotion(){gsap.ticker.sleep()}
