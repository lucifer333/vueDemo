"use strict";

const nunjucks=require('nunjucks');

function createEnv(path, opts) {
    let
        autoescape=opts.autoescape===undefined ? true : opts.autoescape,
        noCache=opts.noCache || false,
        watch=opts.watch || false,
        thrownOnUndefined=opts.throwOnUndefined || false,
        env=new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path,{
                noCache:noCache,
                watch:watch
            }), {
                autoescape:autoescape,
                throwOnUndefined:thrownOnUndefined
            });
    if(opts.filters){
        for(let f in opts.filters){
            if(opts.filters.hasOwnProperty(f)){
                env.addFilter(f, opts.filters[f]);
            }
        }
    }
    return env;
}

function templating(path, opts) {
    let env=createEnv(path, opts);
    return async (ctx, next)=>{
        ctx.render=function (view, model) {
            ctx.response.body=env.render(view,Object.assign({}, ctx.state || {},model || {}));
            ctx.response.type='text/html';
        };
        await next();
    };
}

module.exports=templating;