import { printLine } from './modules/print';
import React from 'react';
import { nanoid } from 'nanoid';
import { createRoot } from 'react-dom/client';
import Translator from './Translator';

printLine("Using the 'printLine' function from the Print Module");
const body = document.body;
const id = nanoid();
const element = document.createElement('div');
element.id = id;
body.append(element);

const container = document.getElementById(id);
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Translator />);
