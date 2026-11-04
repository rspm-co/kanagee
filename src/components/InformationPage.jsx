import React from 'react';
import {informationPages} from '../config/site.js';

export default function InformationPage({path,header,footer}){
  const page=informationPages[path];
  return <>{header}<main id="main" className="information-page section"><a className="text-link" href="/">← KANAGEE home</a><h1>{page.heading}</h1><p className="intro">{page.intro}</p>{page.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p>{section.href&&<a className="text-link" href={section.href}>{section.linkLabel||section.text}</a>}</section>)}</main>{footer}</>;
}
