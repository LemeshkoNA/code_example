const express = require('express');
const next = require('next');
const request = require('request');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, dir: './src'});
const handle = app.getRequestHandler();

const initRequestOptions = (data) => {
    const headers = {'Content-Type': 'application/json'};
    if (this.auth) {
        headers['Authorization'] = this.auth;
    }

    return {
        method: 'POST',
        cache: 'no-cache',
        headers,
        body: JSON.stringify(data),
    };
}

const checkEntry = (req, res, urlEntry, path, slug) => {
    request({url: `${process.env.API_ENDPOINT}/api/public/${urlEntry}/${slug || req.params.slug}`}, (err, httpResponse, body) => {
        if (httpResponse.statusCode === 200) {
            return app.render(req, res, path, {entry: JSON.parse(body)} );
        } else {
            return handle(req, res);
        }
    })
}

app
    .prepare()
    .then(() => {
        const server = express();
        const jsonParser = bodyParser.json();

        server.all('/api/*', jsonParser, (req, res) => {
            const method = req.method.toLowerCase();
            const r = request[method](process.env.API_ENDPOINT + req.originalUrl);

            if (['post', 'put'].includes(method)) {
                r.form(req.body)
            }

            r.pipe(res);
        });

        server.get('/uploads/*', (req, res) => {
            request.get(process.env.API_ENDPOINT + req.originalUrl).pipe(res);
        });

        server.get('/file-storage/*', (req, res) => {
            request.get(process.env.API_ENDPOINT + req.originalUrl).pipe(res);
        });

        server.get('/gallery/image/*', (req, res) => {
            request.get(process.env.API_ENDPOINT + '/gallery/' + req.params[0]).pipe(res);
        });

        server.get('/files/download/*', (req, res) => {
            request.get(process.env.API_ENDPOINT + '/api/public/files/download/' + req.params[0]).pipe(res);
        });

        server.get('/offers/:slug', (req, res) => {
                request({url: `${process.env.API_ENDPOINT}/api/public/offers/${req.params.slug}`}, (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                        return app.render(req, res, '/offers/offer',  {slug: req.params.slug, entry: JSON.parse(body)});
                    } else {
                        return handle(req, res);
                    }
                })
            });

        server.get('/articles/tag/:tag', (req, res) => {
            checkEntry(req, res, '/articles', "/articles", {tag: req.params.tag})
        });

        server.get('/articles/:slug', (req, res) =>{
            request({url: `${process.env.API_ENDPOINT}/api/public/articles/${req.params.slug}`}, (err, httpResponse, body) => {
                if (httpResponse.statusCode === 200) {
                    return app.render(req, res, '/articles/article',  {slug: req.params.slug, entry: JSON.parse(body)});
                } else {
                    return handle(req, res);
                }
            })
        });

        server.get('/news/:slug', (req, res) => {
                request({url: `${process.env.API_ENDPOINT}/api/public/news/${req.params.slug}`}, (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                        return app.render(req, res, '/news/news-article',  {slug: req.params.slug, entry: JSON.parse(body)});
                    } else {
                        return handle(req, res);
                    }
                })
            });

        server.get('/reviews/:slug', (req, res) =>{
                request({url: `${process.env.API_ENDPOINT}/api/public/reviews/${req.params.slug}`}, (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                        return app.render(req, res, '/reviews/review',  {slug: req.params.slug, entry: JSON.parse(body)});
                    } else {
                        return handle(req, res);
                    }
                })
            });

        server.get('/glossary/:slug', (req, res) => {
            request({url: `${process.env.API_ENDPOINT}/api/public/glossary/${req.params.slug}`}, (err, httpResponse, body) => {
                if (httpResponse.statusCode === 200) {
                    return app.render(req, res, '/glossary',  {slug: req.params.slug, entry: JSON.parse(body)});
                } else {
                    return handle(req, res);
                }
            })
        });

        server.get('/download/*', (req, res) => {
            const path = req.params[0];
            const pathArr = path.split('/');
            const lastPathItem = pathArr[pathArr.length - 1];
            let q = {};

            if ((/^.*\..*$/g).test(lastPathItem)) {
                pathArr.splice(pathArr.length - 1, 1);

                q = {
                    path: pathArr.join('/'),
                    file: '/' + path,
                };
            } else {
                q = {
                    path: path,
                    file: null,
                };
            }

            return app.render(req, res, '/download', q);
        });

        server.get('/p/*', (req, res) =>{
                request({url: `${process.env.API_ENDPOINT}/api/public/pages/${req.params[0]}`}, (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                        return app.render(req, res, '/page',  {slug: req.params[0], entry: JSON.parse(body)});
                    } else {
                        return handle(req, res);
                    }
                })
        });

        server.get('/faq/question/:slug', (req, res) => {
            request({url: `${process.env.API_ENDPOINT}/api/public/faq/${req.params.slug}`}, (err, httpResponse, body) => {
                if (httpResponse.statusCode === 200) {
                    return app.render(req, res, '/faq/question',  {slug: req.params.slug, entry: JSON.parse(body)});
                } else {
                    return handle(req, res);
                }
            })
        });

        server.get('/faq/:slug', (req, res) => {
            if(req.params.slug){
                const requestOptions = {
                    method: 'HEAD',
                    // headers: myHeaders,
                    redirect: 'follow'
                };

                fetch(`${process.env.API_ENDPOINT}/api/public/faq/groups/${req.params.slug}`, requestOptions).then(response => {
                    if (response.status === 200) {return app.render(req, res, '/faq', {slug: req.params.slug, });}
                    else { return handle(req, res);}
                })
                //Первый вариант решения задачи PSE-44. Отложил его из-за большого времени загрузки страницы. Компонент index уже адаптирован под него
                //request({url: `${process.env.API_ENDPOINT}/api/public/faq/groups/${req.params.slug}`}, (err, httpResponse, body) => {
                //     if (httpResponse.statusCode === 200) {
                //         return app.render(req, res, '/faq', {slug: req.params.slug, entry: body});
                //     } else {
                //         return handle(req, res);
                //     }
                // })
            } else {
                return app.render(req, res, '/faq', {slug: req.params.slug});

            }
        });

        server.get('/contacts/partnership/:id', (req, res) => {
            return app.render(req, res, '/partnership', {id: req.params.id});
        });

        server.get('/faq/:slug/:q', (req, res) => {
            return app.render(req, res, '/faq', {slug: req.params.slug, q: req.params.q});
        });

        server.get('/track-order/:order', (req, res) => {
            return app.render(req, res, '/track-order', {order: req.params.order});
        });

        server.get('/contacts/cities', (req, res) => {
            return app.render(req, res, '/contacts', {cities: true});
        });

        server.get('/contacts/:slug', (req, res) =>{
            request({url: `${process.env.API_ENDPOINT}/api/public/branches/${req.params.slug}`}, (err, httpResponse, body) => {
                if (httpResponse.statusCode === 200) {
                    return app.render(req, res, '/contacts',  {slug: req.params.slug, entry: JSON.parse(body)});
                } else {
                    return handle(req, res);
                }
            })
        });

        server.get('/cp/offers/:id', (req, res) => {
            return app.render(req, res, '/cp/offers/offer', {id: req.params.id});
        });

        server.get('/cp/uploads/*', (req, res) => {
            return app.render(req, res, '/cp/uploads', {query: req.params});
        });

        server.get('/cp/pages/:id', (req, res) => {
            return app.render(req, res, '/cp/pages/page', {id: req.params.id});
        });

        server.get('/cp/articles/:id', (req, res) => {
            return app.render(req, res, '/cp/articles/article', {id: req.params.id});
        });

        server.get('/cp/mailer-settings/:id', (req, res) => {
            return app.render(req, res, '/cp/mailer-settings/smtp', {id: req.params.id});
        });

        server.get('/cp/news/:id', (req, res) => {
            return app.render(req, res, '/cp/news/news-article', {id: req.params.id});
        });

        server.get('/cp/faq/:id', (req, res) => {
            return app.render(req, res, '/cp/faq/faq', {id: req.params.id});
        });

        server.get('/cp/glossary/:id', (req, res) => {
            return app.render(req, res, '/cp/glossary/glossary', {id: req.params.id});
        });

        server.get('/sitemap.xml', (req, res) => {
            return res.redirect(`${process.env.API_ENDPOINT}/sitemap.xml`);
        });

        server.get('*', (req, res) => {
            const options = initRequestOptions({'uri': req.url})
            let responseData;

            request.post({url: `${process.env.API_ENDPOINT}/api/public/redirect/check`, ...options}, function (err, httpResponse, body) {
                responseData = JSON.parse(body).redirect
                if (req.url !== responseData) {
                    res.redirect(responseData)
                } else {
                    return handle(req, res);
                }
            })
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        })
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1)
    });
