import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {Options} from 'markdown-it';

export enum CustomRendererLifeCycle {
    BeforeRender,
    AfterRender,
    BeforeInlineRender,
    AfterInlineRender,
}

function isCustomRendererLifeCycle(cycle: unknown): cycle is CustomRendererLifeCycle {
    return Object.keys(CustomRendererLifeCycle).includes(
        cycle as keyof typeof CustomRendererLifeCycle,
    );
}

export type CustomRendererParams<S = {}> = {
    handlers?: CustomRendererHanlders;
    hooks?: CustomRendererHooks;
    rules?: Renderer.RenderRuleRecord;
    mode?: CustomRendererMode;
    initState?: () => S;
};

export type CustomRendererHanlders = Record<string, Renderer.RenderRule | Renderer.RenderRule[]>;

export enum CustomRendererMode {
    Production,
    Development,
}

export type CustomRendererHooks = Record<string, RenderHook | RenderHook[]>;

export interface RenderHook {
    (parameters: RenderHookParameters): string;
}

export type RenderHookParameters = {tokens: Token[]; options: Options; env: unknown};

class CustomRenderer<State = {}> extends Renderer {
    protected mode: CustomRendererMode;
    protected handlers: Map<string, Renderer.RenderRule[]>;
    protected state: State;
    protected hooks: Map<CustomRendererLifeCycle, RenderHook[]>;

    constructor({
        mode = CustomRendererMode.Production,
        handlers = {},
        hooks = {},
        rules = {},
        initState = () => ({} as State),
    }: CustomRendererParams<State>) {
        super();

        this.mode = mode;
        this.setRules(rules);

        this.state = initState();
        this.handlers = new Map<string, Renderer.RenderRule[]>();
        this.setHandlers({...handlers});

        this.hooks = new Map<CustomRendererLifeCycle, RenderHook[]>();
        this.setHooks({...hooks});
    }

    setRules(rules: Renderer.RenderRuleRecord) {
        for (const [name, rule] of Object.entries(rules)) {
            if (!rule || !name?.length) {
                continue;
            }

            this.rules[name] = rule.bind(this);
        }
    }

    setHandlers(rules: CustomRendererHanlders) {
        for (const [name, handler] of Object.entries(rules)) {
            if (!handler || !name?.length) {
                continue;
            }

            this.handle(name, handler);
        }
    }

    handle(type: string, handler: Renderer.RenderRule | Renderer.RenderRule[]) {
        const handlers = this.handlers.get(type) ?? [];

        const normalized = (Array.isArray(handler) ? handler : [handler]).map((h) => h.bind(this));

        this.handlers.set(type, [...handlers, ...normalized]);
    }

    setHooks(hooks: CustomRendererHooks) {
        for (const [name, hook] of Object.entries(hooks)) {
            if (isCustomRendererLifeCycle(name)) {
                this.hook(parseInt(name, 10), hook);
            }
        }
    }

    hook(cycle: CustomRendererLifeCycle, hook: RenderHook | RenderHook[]) {
        const hooks = this.hooks.get(cycle) ?? [];

        const normalized = (Array.isArray(hook) ? hook : [hook]).map((h) => h.bind(this));

        this.hooks.set(cycle, [...hooks, ...normalized]);
    }

    runHooks(cycle: CustomRendererLifeCycle, parameters: RenderHookParameters) {
        let rendered = '';

        const hooks = this.hooks.get(cycle) ?? [];

        for (const hook of hooks) {
            rendered += hook(parameters);
        }

        return rendered;
    }

    render(tokens: Token[], options: Options, env: unknown) {
        let rendered = '';

        let children;
        let type;
        let len;
        let i;

        const parameters = {tokens, options, env};

        rendered += this.runHooks(CustomRendererLifeCycle.BeforeRender, parameters);

        for (i = 0, len = tokens.length; i < len; i++) {
            type = tokens[i].type;
            children = tokens[i].children;

            if (type === 'inline' && Array.isArray(children)) {
                rendered += this.renderInline(children, options, env);

                continue;
            }

            rendered += this.processToken(tokens, i, options, env);
        }

        rendered += this.runHooks(CustomRendererLifeCycle.AfterRender, parameters);

        return rendered;
    }

    renderInline(tokens: Token[], options: Options, env: unknown) {
        let rendered = '';

        let len;
        let i;

        const parameters = {tokens, options, env};

        rendered += this.runHooks(CustomRendererLifeCycle.BeforeInlineRender, parameters);

        for (i = 0, len = tokens.length; i < len; i++) {
            rendered += this.processToken(tokens, i, options, env);
        }

        rendered += this.runHooks(CustomRendererLifeCycle.AfterInlineRender, parameters);

        return rendered;
    }

    processToken(tokens: Token[], i: number, options: Options, env: unknown) {
        let rendered = '';

        const type = tokens[i].type;
        const handlers = this.handlers.get(type);
        const rule = this.rules[type];

        if (handlers) {
            for (const handler of handlers) {
                rendered += handler(tokens, i, options, env, this);
            }
        }

        if (rule) {
            rendered += rule(tokens, i, options, env, this);
        } else {
            rendered += this.renderToken(tokens, i, options);
        }

        return rendered;
    }
}

export {CustomRenderer};
export default {CustomRenderer};
