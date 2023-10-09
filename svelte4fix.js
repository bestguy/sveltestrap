const { readdirSync, readFileSync, writeFileSync } = require("fs");
// Fix svelte-check issue with sveltestrap
function fixSCforSS() {
    const root = "./src";
    readdirSync(root).forEach(file => {
        if (file.endsWith(".d.ts")) {
            const file_path = `${root}/${file}`;
            let ts = readFileSync(file_path, {encoding: "utf8"});

            const aloneLF = /\n(?!\r)/g;
            ts = ts.replace(aloneLF, '\r\n');

            // use the new `SvelteComponent` interface
            ts = ts.replaceAll('SvelteComponentTyped', 'SvelteComponent');

            // use normal export, not default, otherwise we need to move inside the interface all the top-level imports
            ts = ts.replaceAll('export default class', 'export class');

            // fix missing `type` in imports
            ts = ts.replaceAll(`import { BackgroundColor } from './shared';`, `import type { BackgroundColor } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { Breakpoints } from './shared';`, `import type { Breakpoints } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { Breakpoints, ContainerType } from './shared';`, `import type { Breakpoints, ContainerType } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { ButtonProps } from './Button';`, `import type { ButtonProps } from './Button.d.ts';`);
            ts = ts.replaceAll(`import { Color } from './shared';`, `import type { Color } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { ColumnProps } from './Col';`, `import type { ColumnProps } from './Col.d.ts';`);
            ts = ts.replaceAll(`import { ContainerType } from './shared';`, `import type { ContainerType } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { Direction } from './shared';`, `import type { Direction } from './shared.d.ts';`);
            ts = ts.replaceAll(`import { DropdownProps } from './Dropdown';`, `import type { DropdownProps } from './Dropdown.d.ts';`);
            ts = ts.replaceAll(`import { FadeProps } from './Fade';`, `import type { FadeProps } from './Fade.d.ts';`);
            ts = ts.replaceAll(`import { TextColor } from './shared';`, `import type { TextColor } from './shared.d.ts';`);

            // it's tricky... it needs to import the type also...
            // ts = ts.replaceAll(`extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']>`, 'HTMLInputAttributes');

            // wrap the interface in a `module`
            ts = `declare module 'sveltestrap' {\r\n` + ts + `\r\n}\r\n`;

            // replace `events` and `slots` with `any`
            ts = ts.replaceAll(`{ default: {} }`, 'any');
            ts = ts.replaceAll(`{},`, 'any,');
            ts = ts.replaceAll(`{}>`, 'any>');

            // add `class?` as attribute to all the components
            ts = ts.replaceAll(`}\r\n\r\nexport class`, `class?: string;\r\n}\r\n\r\nexport class`);
            writeFileSync(file_path, ts);
        }
    })
}
fixSCforSS() 