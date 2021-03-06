/* eslint max-nested-callbacks: [1, 7] */
/* eslint-disable import/no-named-as-default */

import React from "react";
import ReactDOM from "react-dom";
import ReactServer from "react-dom/server";
import {Helmet, HelmetProvider, createHelmetStore} from "../src/Helmet";
import {requestAnimationFrame} from "../src/HelmetUtils.js";

const HELMET_ATTRIBUTE = "data-react-helmet";

describe("Helmet", () => {
    let headElement;

    const container = document.createElement("div");

    beforeEach(() => {
        headElement =
            headElement || document.head || document.querySelector("head");

        // resets DOM after each run
        headElement.innerHTML = "";
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
    });

    describe("api", () => {
        describe("title", () => {
            it("updates page title", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            defaultTitle={"Fallback"}
                            title={"Test Title"}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal("Test Title");

                    done();
                });
            });

            it("updates page title with multiple children", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet title={"Test Title"} />
                            <Helmet title={"Child One Title"} />
                            <Helmet title={"Child Two Title"} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal("Child Two Title");

                    done();
                });
            });

            it("sets title based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet title={"Main Title"} />
                            <Helmet title={"Nested Title"} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal("Nested Title");

                    done();
                });
            });

            it("sets title using deepest nested component with a defined title", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet title={"Main Title"} />
                            <Helmet />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal("Main Title");

                    done();
                });
            });

            it("uses defaultTitle if no title is defined", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            defaultTitle={"Fallback"}
                            title={""}
                            titleTemplate={
                                "This is a %s of the titleTemplate feature"
                            }
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal("Fallback");

                    done();
                });
            });

            it("uses a titleTemplate if defined", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            defaultTitle={"Fallback"}
                            title={"Test"}
                            titleTemplate={
                                "This is a %s of the titleTemplate feature"
                            }
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(
                        "This is a Test of the titleTemplate feature"
                    );

                    done();
                });
            });

            it("replaces multiple title strings in titleTemplate", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            title={"Test"}
                            titleTemplate={
                                "This is a %s of the titleTemplate feature. Another %s."
                            }
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(
                        "This is a Test of the titleTemplate feature. Another Test."
                    );

                    done();
                });
            });

            it("uses a titleTemplate based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                title={"Test"}
                                titleTemplate={
                                    "This is a %s of the titleTemplate feature"
                                }
                            />
                            <Helmet
                                title={"Second Test"}
                                titleTemplate={
                                    "A %s using nested titleTemplate attributes"
                                }
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(
                        "A Second Test using nested titleTemplate attributes"
                    );

                    done();
                });
            });

            it("merges deepest component title with nearest upstream titleTemplate", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                title={"Test"}
                                titleTemplate={
                                    "This is a %s of the titleTemplate feature"
                                }
                            />
                            <Helmet title={"Second Test"} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(
                        "This is a Second Test of the titleTemplate feature"
                    );

                    done();
                });
            });

            it("renders dollar characters in a title correctly when titleTemplate present", done => {
                const store = createHelmetStore();
                const dollarTitle = "te$t te$$t te$$$t te$$$$t";

                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            title={dollarTitle}
                            titleTemplate={"This is a %s"}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(
                        "This is a te$t te$$t te$$$t te$$$$t"
                    );

                    done();
                });
            });

            it("does not encode all characters with HTML character entity equivalents", done => {
                const store = createHelmetStore();
                const chineseTitle = "膣膗 鍆錌雔";

                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet title={chineseTitle} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(document.title).to.equal(chineseTitle);

                    done();
                });
            });

            it("page title with prop itemprop", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            defaultTitle={"Fallback"}
                            title={"Test Title with itemProp"}
                            titleAttributes={{itemprop: "name"}}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const titleTag = document.getElementsByTagName("title")[0];
                    expect(document.title).to.equal("Test Title with itemProp");
                    expect(titleTag.getAttribute("itemprop")).to.equal("name");

                    done();
                });
            });
        });

        describe("title attributes", () => {
            beforeEach(() => {
                headElement.innerHTML = `<title>Test Title</title>`;
            });

            it("update title attributes", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            titleAttributes={{
                                itemprop: "name"
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const titleTag = document.getElementsByTagName("title")[0];
                    expect(titleTag.getAttribute("itemprop")).to.equal("name");
                    expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "itemprop"
                    );

                    done();
                });
            });

            it("sets attributes based on the deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                titleAttributes={{
                                    lang: "en",
                                    hidden: undefined
                                }}
                            />
                            <Helmet
                                titleAttributes={{
                                    lang: "ja"
                                }}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const titleTag = document.getElementsByTagName("title")[0];
                    expect(titleTag.getAttribute("lang")).to.equal("ja");
                    expect(titleTag.getAttribute("hidden")).to.equal("");
                    expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "lang,hidden"
                    );

                    done();
                });
            });

            it("handles valueless attributes", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            titleAttributes={{
                                hidden: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const titleTag = document.getElementsByTagName("title")[0];
                    expect(titleTag.getAttribute("hidden")).to.equal("");
                    expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "hidden"
                    );

                    done();
                });
            });

            it("clears title attributes that are handled within helmet", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            titleAttributes={{
                                lang: "en",
                                hidden: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const titleTag = document.getElementsByTagName(
                            "title"
                        )[0];
                        expect(titleTag.getAttribute("lang")).to.be.null;
                        expect(titleTag.getAttribute("hidden")).to.be.null;
                        expect(
                            titleTag.getAttribute(HELMET_ATTRIBUTE)
                        ).to.equal(null);

                        done();
                    });
                });
            });
        });

        describe("html attributes", () => {
            it("updates html attributes", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            htmlAttributes={{
                                class: "myClassName",
                                lang: "en"
                            }}
                            lang="en"
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const htmlTag = document.getElementsByTagName("html")[0];
                    expect(htmlTag.getAttribute("class")).to.equal(
                        "myClassName"
                    );
                    expect(htmlTag.getAttribute("lang")).to.equal("en");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "class,lang"
                    );

                    done();
                });
            });

            it("sets attributes based on the deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                htmlAttributes={{
                                    lang: "en"
                                }}
                            />
                            <Helmet
                                htmlAttributes={{
                                    lang: "ja"
                                }}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const htmlTag = document.getElementsByTagName("html")[0];
                    expect(htmlTag.getAttribute("lang")).to.equal("ja");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "lang"
                    );

                    done();
                });
            });

            it("handles valueless attributes", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            htmlAttributes={{
                                amp: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const htmlTag = document.getElementsByTagName("html")[0];
                    expect(htmlTag.getAttribute("amp")).to.equal("");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                        "amp"
                    );

                    done();
                });
            });

            it("clears html attributes that are handled within helmet", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            htmlAttributes={{
                                lang: "en",
                                amp: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const htmlTag = document.getElementsByTagName(
                            "html"
                        )[0];
                        expect(htmlTag.getAttribute("lang")).to.be.null;
                        expect(htmlTag.getAttribute("amp")).to.be.null;
                        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                            null
                        );

                        done();
                    });
                });
            });

            it("updates with multiple additions and removals - overwrite and new", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            htmlAttributes={{
                                lang: "en",
                                amp: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet
                                htmlAttributes={{
                                    lang: "ja",
                                    id: "html-tag",
                                    title: "html tag"
                                }}
                            />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const htmlTag = document.getElementsByTagName(
                            "html"
                        )[0];
                        expect(htmlTag.getAttribute("amp")).to.equal(null);
                        expect(htmlTag.getAttribute("lang")).to.equal("ja");
                        expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                        expect(htmlTag.getAttribute("title")).to.equal(
                            "html tag"
                        );
                        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                            "lang,id,title"
                        );

                        done();
                    });
                });
            });

            it("updates with multiple additions and removals - all new", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            htmlAttributes={{
                                lang: "en",
                                amp: undefined
                            }}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet
                                htmlAttributes={{
                                    id: "html-tag",
                                    title: "html tag"
                                }}
                            />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const htmlTag = document.getElementsByTagName(
                            "html"
                        )[0];
                        expect(htmlTag.getAttribute("amp")).to.equal(null);
                        expect(htmlTag.getAttribute("lang")).to.equal(null);
                        expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                        expect(htmlTag.getAttribute("title")).to.equal(
                            "html tag"
                        );
                        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                            "id,title"
                        );

                        done();
                    });
                });
            });

            context("initialized outside of helmet", () => {
                before(() => {
                    const htmlTag = document.getElementsByTagName("html")[0];
                    htmlTag.setAttribute("test", "test");
                });

                it("attributes are not cleared", done => {
                    const store = createHelmetStore();
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const htmlTag = document.getElementsByTagName(
                            "html"
                        )[0];
                        expect(htmlTag.getAttribute("test")).to.equal("test");
                        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                            null
                        );

                        done();
                    });
                });

                it("attributes are overwritten if specified in helmet", done => {
                    const store = createHelmetStore();
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet
                                htmlAttributes={{
                                    test: "helmet-attr"
                                }}
                            />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const htmlTag = document.getElementsByTagName(
                            "html"
                        )[0];
                        expect(htmlTag.getAttribute("test")).to.equal(
                            "helmet-attr"
                        );
                        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(
                            "test"
                        );

                        done();
                    });
                });

                it("attributes are cleared once managed in helmet", done => {
                    const store = createHelmetStore();
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet
                                htmlAttributes={{
                                    test: "helmet-attr"
                                }}
                            />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        ReactDOM.render(
                            <HelmetProvider store={store}>
                                <Helmet />
                            </HelmetProvider>,
                            container
                        );

                        requestAnimationFrame(() => {
                            const htmlTag = document.getElementsByTagName(
                                "html"
                            )[0];
                            expect(htmlTag.getAttribute("test")).to.equal(null);
                            expect(
                                htmlTag.getAttribute(HELMET_ATTRIBUTE)
                            ).to.equal(null);

                            done();
                        });
                    });
                });
            });
        });

        describe("onChangeClientState", () => {
            it("when handling client state change, calls the function with new state, addedTags and removedTags ", done => {
                const store = createHelmetStore();
                const spy = sinon.spy();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                base={{href: "http://mysite.com/"}}
                                link={[
                                    {
                                        href: "http://localhost/helmet",
                                        rel: "canonical"
                                    }
                                ]}
                                meta={[{charset: "utf-8"}]}
                                script={[
                                    {
                                        src: "http://localhost/test.js",
                                        type: "text/javascript"
                                    }
                                ]}
                                title={"Main Title"}
                                onChangeClientState={spy}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(spy.called).to.equal(true);
                    const newState = spy.getCall(0).args[0];
                    const addedTags = spy.getCall(0).args[1];
                    const removedTags = spy.getCall(0).args[2];

                    expect(newState).to.deep.contain({title: "Main Title"});
                    expect(newState.baseTag).to.deep.contain({
                        href: "http://mysite.com/"
                    });
                    expect(newState.metaTags).to.deep.contain({
                        charset: "utf-8"
                    });
                    expect(newState.linkTags).to.deep.contain({
                        href: "http://localhost/helmet",
                        rel: "canonical"
                    });
                    expect(newState.scriptTags).to.deep.contain({
                        src: "http://localhost/test.js",
                        type: "text/javascript"
                    });

                    expect(addedTags).to.have.property("baseTag");
                    expect(addedTags.baseTag).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.baseTag[0].outerHTML).to.equal(
                        `<base href="http://mysite.com/" data-react-helmet="true">`
                    );

                    expect(addedTags).to.have.property("metaTags");
                    expect(addedTags.metaTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.metaTags[0].outerHTML).to.equal(
                        `<meta charset="utf-8" data-react-helmet="true">`
                    );

                    expect(addedTags).to.have.property("linkTags");
                    expect(addedTags.linkTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.linkTags[0].outerHTML).to.equal(
                        `<link href="http://localhost/helmet" rel="canonical" data-react-helmet="true">`
                    );

                    expect(addedTags).to.have.property("scriptTags");
                    expect(addedTags.scriptTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.scriptTags[0].outerHTML).to.equal(
                        `<script src="http://localhost/test.js" type="text/javascript" data-react-helmet="true"></script>`
                    );

                    expect(removedTags).to.be.empty;

                    done();
                });
            });

            it("calls the deepest defined callback with the deepest state", done => {
                const store = createHelmetStore();
                const spy = sinon.spy();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                title={"Main Title"}
                                onChangeClientState={spy}
                            />
                            <Helmet title={"Deeper Title"} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(spy.callCount).to.equal(1);
                    expect(spy.getCall(0).args[0]).to.deep.contain({
                        title: "Deeper Title"
                    });

                    done();
                });
            });
        });

        describe("base tag", () => {
            it("updates base tag", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet base={{href: "http://mysite.com/"}} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `base[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);

                    const filteredTags = [].slice
                        .call(existingTags)
                        .filter(tag => {
                            return (
                                tag.getAttribute("href") ===
                                "http://mysite.com/"
                            );
                        });

                    expect(filteredTags.length).to.equal(1);

                    done();
                });
            });

            it("clears the base tag if one is not specified", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet base={{href: "http://mysite.com/"}} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const existingTags = headElement.querySelectorAll(
                            `base[${HELMET_ATTRIBUTE}]`
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'href' are not accepted", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet base={{property: "won't work"}} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `base[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("sets base tag based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet base={{href: "http://mysite.com/"}} />
                            <Helmet base={{href: "http://mysite.com/public"}} />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `base[${HELMET_ATTRIBUTE}]`
                    );
                    const firstTag = Array.prototype.slice.call(
                        existingTags
                    )[0];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.equal(1);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://mysite.com/public"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<base href="http://mysite.com/public" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("does not render tag when primary attribute is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet base={{href: undefined}} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `base[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });
        });

        describe("meta tags", () => {
            it("updates meta tags", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            meta={[
                                {charset: "utf-8"},
                                {
                                    name: "description",
                                    content: "Test description"
                                },
                                {
                                    "http-equiv": "content-type",
                                    content: "text/html"
                                },
                                {property: "og:type", content: "article"},
                                {
                                    itemprop: "name",
                                    content: "Test name itemprop"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);

                    expect(existingTags).to.not.equal(undefined);

                    const filteredTags = [].slice
                        .call(existingTags)
                        .filter(tag => {
                            return (
                                tag.getAttribute("charset") === "utf-8" ||
                                (tag.getAttribute("name") === "description" &&
                                    tag.getAttribute("content") ===
                                        "Test description") ||
                                (tag.getAttribute("http-equiv") ===
                                    "content-type" &&
                                    tag.getAttribute("content") ===
                                        "text/html") ||
                                (tag.getAttribute("itemprop") === "name" &&
                                    tag.getAttribute("content") ===
                                        "Test name itemprop")
                            );
                        });

                    expect(filteredTags.length).to.be.at.least(4);

                    done();
                });
            });

            it("clears all meta tags if none are specified", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            meta={[
                                {
                                    name: "description",
                                    content: "Test description"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const existingTags = headElement.querySelectorAll(
                            `meta[${HELMET_ATTRIBUTE}]`
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' are not accepted", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet meta={[{href: "won't work"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("sets meta tags based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                meta={[
                                    {charset: "utf-8"},
                                    {
                                        name: "description",
                                        content: "Test description"
                                    }
                                ]}
                            />
                            <Helmet
                                meta={[
                                    {
                                        name: "description",
                                        content: "Inner description"
                                    },
                                    {
                                        name: "keywords",
                                        content: "test,meta,tags"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);

                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];
                    const thirdTag = existingTags[2];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.equal(3);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("charset")).to.equal("utf-8");
                    expect(firstTag.outerHTML).to.equal(
                        `<meta charset="utf-8" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(secondTag.getAttribute("content")).to.equal(
                        "Inner description"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[2]")
                        .that.is.an.instanceof(Element);
                    expect(thirdTag).to.have.property("getAttribute");
                    expect(thirdTag.getAttribute("name")).to.equal("keywords");
                    expect(thirdTag.getAttribute("content")).to.equal(
                        "test,meta,tags"
                    );
                    expect(thirdTag.outerHTML).to.equal(
                        `<meta name="keywords" content="test,meta,tags" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("allows duplicate meta tags if specified in the same component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            meta={[
                                {
                                    name: "description",
                                    content: "Test description"
                                },
                                {
                                    name: "description",
                                    content: "Duplicate description"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.equal(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(firstTag.getAttribute("content")).to.equal(
                        "Test description"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(secondTag.getAttribute("content")).to.equal(
                        "Duplicate description"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<meta name="description" content="Duplicate description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("overrides duplicate meta tags with single meta tag in a nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                meta={[
                                    {
                                        name: "description",
                                        content: "Test description"
                                    },
                                    {
                                        name: "description",
                                        content: "Duplicate description"
                                    }
                                ]}
                            />
                            <Helmet
                                meta={[
                                    {
                                        name: "description",
                                        content: "Inner description"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.equal(1);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(firstTag.getAttribute("content")).to.equal(
                        "Inner description"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("overrides single meta tag with duplicate meta tags in a nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                meta={[
                                    {
                                        name: "description",
                                        content: "Test description"
                                    }
                                ]}
                            />
                            <Helmet
                                meta={[
                                    {
                                        name: "description",
                                        content: "Inner description"
                                    },
                                    {
                                        name: "description",
                                        content: "Inner duplicate description"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.equal(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(firstTag.getAttribute("content")).to.equal(
                        "Inner description"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("name")).to.equal(
                        "description"
                    );
                    expect(secondTag.getAttribute("content")).to.equal(
                        "Inner duplicate description"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<meta name="description" content="Inner duplicate description" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("does not render tag when primary attribute is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            meta={[
                                {
                                    name: undefined,
                                    content: "Inner duplicate description"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });

            it("fails gracefully when meta is wrong shape", done => {
                const store = createHelmetStore();
                const error = sinon.stub(console, "error");
                const warn = sinon.stub(console, "warn");

                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet meta={{name: "title", content: "some title"}} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `meta[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    expect(error.called).to.be.true;
                    expect(warn.called).to.be.true;

                    const [warning] = warn.getCall(0).args;
                    expect(warning).to.equal(
                        `Helmet: meta should be of type "Array". Instead found type "object"`
                    );

                    error.restore();
                    warn.restore();

                    done();
                });
            });
        });

        describe("link tags", () => {
            it("updates link tags", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            link={[
                                {
                                    href: "http://localhost/helmet",
                                    rel: "canonical"
                                },
                                {
                                    href: "http://localhost/style.css",
                                    rel: "stylesheet",
                                    type: "text/css"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);

                    expect(existingTags).to.not.equal(undefined);

                    const filteredTags = [].slice
                        .call(existingTags)
                        .filter(tag => {
                            return (
                                (tag.getAttribute("href") ===
                                    "http://localhost/style.css" &&
                                    tag.getAttribute("rel") === "stylesheet" &&
                                    tag.getAttribute("type") === "text/css") ||
                                (tag.getAttribute("href") ===
                                    "http://localhost/helmet" &&
                                    tag.getAttribute("rel") === "canonical")
                            );
                        });

                    expect(filteredTags.length).to.be.at.least(2);

                    done();
                });
            });

            it("clears all link tags if none are specified", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            link={[
                                {
                                    href: "http://localhost/helmet",
                                    rel: "canonical"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const tagNodes = headElement.querySelectorAll(
                            `link[${HELMET_ATTRIBUTE}]`
                        );
                        const existingTags = Array.prototype.slice.call(
                            tagNodes
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet link={[{"http-equiv": "won't work"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                link={[
                                    {
                                        href: "http://localhost/helmet",
                                        rel: "canonical"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href: "http://localhost/helmet/new"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        href: "http://localhost/helmet/newest",
                                        rel: "canonical"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.equal(1);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("rel")).to.equal("canonical");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/newest"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<link href="http://localhost/helmet/newest" rel="canonical" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                link={[
                                    {
                                        href: "http://localhost/style.css",
                                        rel: "stylesheet",
                                        type: "text/css",
                                        media: "all"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        rel: "stylesheet",
                                        href: "http://localhost/inner.css",
                                        type: "text/css",
                                        media: "all"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.equal(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/style.css"
                    );
                    expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                    expect(firstTag.getAttribute("type")).to.equal("text/css");
                    expect(firstTag.getAttribute("media")).to.equal("all");
                    expect(firstTag.outerHTML).to.equal(
                        `<link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("rel")).to.equal(
                        "stylesheet"
                    );
                    expect(secondTag.getAttribute("href")).to.equal(
                        "http://localhost/inner.css"
                    );
                    expect(secondTag.getAttribute("type")).to.equal("text/css");
                    expect(secondTag.getAttribute("media")).to.equal("all");
                    expect(secondTag.outerHTML).to.equal(
                        `<link rel="stylesheet" href="http://localhost/inner.css" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("sets link tags based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href: "http://localhost/helmet"
                                    },
                                    {
                                        href: "http://localhost/style.css",
                                        rel: "stylesheet",
                                        type: "text/css",
                                        media: "all"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href:
                                            "http://localhost/helmet/innercomponent"
                                    },
                                    {
                                        href: "http://localhost/inner.css",
                                        rel: "stylesheet",
                                        type: "text/css",
                                        media: "all"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];
                    const thirdTag = existingTags[2];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.at.least(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/style.css"
                    );
                    expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                    expect(firstTag.getAttribute("type")).to.equal("text/css");
                    expect(firstTag.getAttribute("media")).to.equal("all");
                    expect(firstTag.outerHTML).to.equal(
                        `<link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/innercomponent"
                    );
                    expect(secondTag.getAttribute("rel")).to.equal("canonical");
                    expect(secondTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[2]")
                        .that.is.an.instanceof(Element);
                    expect(thirdTag).to.have.property("getAttribute");
                    expect(thirdTag.getAttribute("href")).to.equal(
                        "http://localhost/inner.css"
                    );
                    expect(thirdTag.getAttribute("rel")).to.equal("stylesheet");
                    expect(thirdTag.getAttribute("type")).to.equal("text/css");
                    expect(thirdTag.getAttribute("media")).to.equal("all");
                    expect(thirdTag.outerHTML).to.equal(
                        `<link href="http://localhost/inner.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("allows duplicate link tags if specified in the same component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            link={[
                                {
                                    rel: "canonical",
                                    href: "http://localhost/helmet"
                                },
                                {
                                    rel: "canonical",
                                    href: "http://localhost/helmet/component"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.at.least(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("rel")).to.equal("canonical");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("rel")).to.equal("canonical");
                    expect(secondTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/component"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("overrides duplicate link tags with a single link tag in a nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href: "http://localhost/helmet"
                                    },
                                    {
                                        rel: "canonical",
                                        href:
                                            "http://localhost/helmet/component"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href:
                                            "http://localhost/helmet/innercomponent"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.equal(1);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("rel")).to.equal("canonical");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/innercomponent"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("overrides single link tag with duplicate link tags in a nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href: "http://localhost/helmet"
                                    }
                                ]}
                            />
                            <Helmet
                                link={[
                                    {
                                        rel: "canonical",
                                        href:
                                            "http://localhost/helmet/component"
                                    },
                                    {
                                        rel: "canonical",
                                        href:
                                            "http://localhost/helmet/innercomponent"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.equal(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("rel")).to.equal("canonical");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/component"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("rel")).to.equal("canonical");
                    expect(secondTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/innercomponent"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });

            it("does not render tag when primary attribute is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            link={[
                                {rel: "icon", sizes: "192x192", href: null},
                                {
                                    rel: "canonical",
                                    href: "http://localhost/helmet/component"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `link[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.be.equal(1);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("rel")).to.equal("canonical");
                    expect(firstTag.getAttribute("href")).to.equal(
                        "http://localhost/helmet/component"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`
                    );

                    done();
                });
            });
        });

        describe("script tags", () => {
            it("updates script tags", done => {
                const store = createHelmetStore();
                const scriptInnerHTML = `
                  {
                    "@context": "http://schema.org",
                    "@type": "NewsArticle",
                    "url": "http://localhost/helmet"
                  }
                `;
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            script={[
                                {
                                    src: "http://localhost/test.js",
                                    type: "text/javascript"
                                },
                                {
                                    src: "http://localhost/test2.js",
                                    type: "text/javascript"
                                },
                                {
                                    type: "application/ld+json",
                                    innerHTML: scriptInnerHTML
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.getElementsByTagName(
                        "script"
                    );

                    expect(existingTags).to.not.equal(undefined);

                    const filteredTags = [].slice
                        .call(existingTags)
                        .filter(tag => {
                            return (
                                (tag.getAttribute("src") ===
                                    "http://localhost/test.js" &&
                                    tag.getAttribute("type") ===
                                        "text/javascript") ||
                                (tag.getAttribute("src") ===
                                    "http://localhost/test2.js" &&
                                    tag.getAttribute("type") ===
                                        "text/javascript") ||
                                (tag.getAttribute("type") ===
                                    "application/ld+json" &&
                                    tag.innerHTML === scriptInnerHTML)
                            );
                        });

                    expect(filteredTags.length).to.be.at.least(3);

                    done();
                });
            });

            it("clears all scripts tags if none are specified", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            script={[
                                {
                                    src: "http://localhost/test.js",
                                    type: "text/javascript"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const existingTags = headElement.querySelectorAll(
                            `script[${HELMET_ATTRIBUTE}]`
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'src' are not accepted", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet script={[{property: "won't work"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `script[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("sets script tags based on deepest nested component", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <div>
                            <Helmet
                                script={[
                                    {
                                        src: "http://localhost/test.js",
                                        type: "text/javascript"
                                    }
                                ]}
                            />
                            <Helmet
                                script={[
                                    {
                                        src: "http://localhost/test2.js",
                                        type: "text/javascript"
                                    }
                                ]}
                            />
                        </div>
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `script[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    const firstTag = existingTags[0];
                    const secondTag = existingTags[1];

                    expect(existingTags).to.not.equal(undefined);

                    expect(existingTags.length).to.be.at.least(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("src")).to.equal(
                        "http://localhost/test.js"
                    );
                    expect(firstTag.getAttribute("type")).to.equal(
                        "text/javascript"
                    );
                    expect(firstTag.outerHTML).to.equal(
                        `<script src="http://localhost/test.js" type="text/javascript" ${HELMET_ATTRIBUTE}="true"></script>`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag).to.have.property("getAttribute");
                    expect(secondTag.getAttribute("src")).to.equal(
                        "http://localhost/test2.js"
                    );
                    expect(secondTag.getAttribute("type")).to.equal(
                        "text/javascript"
                    );
                    expect(secondTag.outerHTML).to.equal(
                        `<script src="http://localhost/test2.js" type="text/javascript" ${HELMET_ATTRIBUTE}="true"></script>`
                    );

                    done();
                });
            });

            it("sets undefined attribute values to empty strings", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            script={[
                                {
                                    src: "foo.js",
                                    async: undefined
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTag = headElement.querySelector(
                        `script[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTag).to.not.equal(undefined);
                    expect(existingTag.outerHTML)
                        .to.be.a("string")
                        .that.equals(
                            `<script src="foo.js" async="" ${HELMET_ATTRIBUTE}="true"></script>`
                        );

                    done();
                });
            });

            it("does not render tag when primary attribute (src) is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            script={[
                                {
                                    src: undefined,
                                    type: "text/javascript"
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `script[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });

            it("does not render tag when primary attribute (innerHTML) is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            script={[
                                {
                                    innerHTML: undefined
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `script[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });
        });

        describe("noscript tags", () => {
            it("updates noscript tags", done => {
                const store = createHelmetStore();
                const noscriptInnerHTML = `<link rel="stylesheet" type="text/css" href="foo.css" />`;
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            noscript={[
                                {id: "bar", innerHTML: noscriptInnerHTML}
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.getElementsByTagName(
                        "noscript"
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(1);
                    expect(
                        existingTags[0].innerHTML === noscriptInnerHTML &&
                            existingTags[0].id === "bar"
                    );

                    done();
                });
            });

            it("clears all noscripts tags if none are specified", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet noscript={[{id: "bar"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const existingTags = headElement.querySelectorAll(
                            `script[${HELMET_ATTRIBUTE}]`
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'innerHTML' are not accepted", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet noscript={[{property: "won't work"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `noscript[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("does not render tag when primary attribute is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            noscript={[
                                {
                                    innerHTML: undefined
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `noscript[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });
        });

        describe("style tags", () => {
            it("updates style tags", done => {
                const store = createHelmetStore();
                const cssText1 = `
                    body {
                        background-color: green;
                    }
                `;
                const cssText2 = `
                    p {
                        font-size: 12px;
                    }
                `;
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            style={[
                                {
                                    type: "text/css",
                                    cssText: cssText1
                                },
                                {
                                    cssText: cssText2
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `style[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);

                    const [firstTag, secondTag] = existingTags;
                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.be.equal(2);

                    expect(existingTags)
                        .to.have.deep.nested.property("[0]")
                        .that.is.an.instanceof(Element);
                    expect(firstTag).to.have.property("getAttribute");
                    expect(firstTag.getAttribute("type")).to.equal("text/css");
                    expect(firstTag.innerHTML).to.equal(cssText1);
                    expect(firstTag.outerHTML).to.equal(
                        `<style type="text/css" ${HELMET_ATTRIBUTE}="true">${cssText1}</style>`
                    );

                    expect(existingTags)
                        .to.have.deep.nested.property("[1]")
                        .that.is.an.instanceof(Element);
                    expect(secondTag.innerHTML).to.equal(cssText2);
                    expect(secondTag.outerHTML).to.equal(
                        `<style ${HELMET_ATTRIBUTE}="true">${cssText2}</style>`
                    );

                    done();
                });
            });

            it("clears all style tags if none are specified", done => {
                const store = createHelmetStore();
                const cssText = `
                    body {
                        background-color: green;
                    }
                `;
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            style={[
                                {
                                    type: "text/css",
                                    cssText
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    ReactDOM.render(
                        <HelmetProvider store={store}>
                            <Helmet />
                        </HelmetProvider>,
                        container
                    );

                    requestAnimationFrame(() => {
                        const existingTags = headElement.querySelectorAll(
                            `style[${HELMET_ATTRIBUTE}]`
                        );

                        expect(existingTags).to.not.equal(undefined);
                        expect(existingTags.length).to.equal(0);

                        done();
                    });
                });
            });

            it("tags without 'cssText' are not accepted", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet style={[{property: "won't work"}]} />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const existingTags = headElement.querySelectorAll(
                        `style[${HELMET_ATTRIBUTE}]`
                    );

                    expect(existingTags).to.not.equal(undefined);
                    expect(existingTags.length).to.equal(0);

                    done();
                });
            });

            it("does not render tag when primary attribute is null", done => {
                const store = createHelmetStore();
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            style={[
                                {
                                    cssText: undefined
                                }
                            ]}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    const tagNodes = headElement.querySelectorAll(
                        `style[${HELMET_ATTRIBUTE}]`
                    );
                    const existingTags = Array.prototype.slice.call(tagNodes);
                    expect(existingTags).to.be.empty;

                    done();
                });
            });
        });
    });

    describe("deferred tags", () => {
        beforeEach(() => {
            window.__spy__ = sinon.spy();
        });

        afterEach(() => {
            delete window.__spy__;
        });

        it("executes synchronously when defer={true} and async otherwise", done => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <div>
                        <Helmet
                            defer={false}
                            script={[
                                {
                                    innerHTML: `window.__spy__(1)`
                                }
                            ]}
                        />
                        <Helmet
                            script={[
                                {
                                    innerHTML: `window.__spy__(2)`
                                }
                            ]}
                        />
                    </div>
                </HelmetProvider>,
                container
            );

            expect(window.__spy__.callCount).to.equal(1);

            requestAnimationFrame(() => {
                expect(window.__spy__.callCount).to.equal(2);
                expect(window.__spy__.args).to.deep.equal([[1], [2]]);
                done();
            });
        });
    });

    describe("server", () => {
        const stringifiedHtmlAttributes = `lang="ga" class="myClassName"`;
        const stringifiedTitle = `<title ${HELMET_ATTRIBUTE}="true">Dangerous &lt;script&gt; include</title>`;
        const unEncodedStringifiedTitle = `<title ${HELMET_ATTRIBUTE}="true">This is text and & and '.</title>`;
        const stringifiedTitleWithItemprop = `<title ${HELMET_ATTRIBUTE}="true" itemprop="name">Title with Itemprop</title>`;
        const stringifiedBaseTag = `<base ${HELMET_ATTRIBUTE}="true" target="_blank" href="http://localhost/"/>`;

        const stringifiedMetaTags = [
            `<meta ${HELMET_ATTRIBUTE}="true" charset="utf-8"/>`,
            `<meta ${HELMET_ATTRIBUTE}="true" name="description" content="Test description &amp; encoding of special characters like &#x27; &quot; &gt; &lt; \`"/>`,
            `<meta ${HELMET_ATTRIBUTE}="true" http-equiv="content-type" content="text/html"/>`,
            `<meta ${HELMET_ATTRIBUTE}="true" property="og:type" content="article"/>`,
            `<meta ${HELMET_ATTRIBUTE}="true" itemprop="name" content="Test name itemprop"/>`
        ].join("");

        const stringifiedLinkTags = [
            `<link ${HELMET_ATTRIBUTE}="true" href="http://localhost/helmet" rel="canonical"/>`,
            `<link ${HELMET_ATTRIBUTE}="true" href="http://localhost/style.css" rel="stylesheet" type="text/css"/>`
        ].join("");

        const stringifiedScriptTags = [
            `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript"></script>`,
            `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test2.js" type="text/javascript"></script>`
        ].join("");

        const stringifiedNoscriptTags = [
            `<noscript ${HELMET_ATTRIBUTE}="true" id="foo"><link rel="stylesheet" type="text/css" href="/style.css" /></noscript>`,
            `<noscript ${HELMET_ATTRIBUTE}="true" id="bar"><link rel="stylesheet" type="text/css" href="/style2.css" /></noscript>`
        ].join("");

        const stringifiedStyleTags = [
            `<style ${HELMET_ATTRIBUTE}="true" type="text/css">body {background-color: green;}</style>`,
            `<style ${HELMET_ATTRIBUTE}="true" type="text/css">p {font-size: 12px;}</style>`
        ].join("");

        before(() => {
            Helmet.canUseDOM = false;
        });

        it("provides initial values if no state is found", () => {
            const store = createHelmetStore();
            let head = store.renderStatic();
            head = store.renderStatic();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");

            expect(head.meta.toString()).to.equal("");
        });

        it("encodes special characters in title", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet title="Dangerous <script> include" />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.equal(stringifiedTitle);
        });

        it("opts out of string encoding", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        encodeSpecialCharacters={false}
                        title={"This is text and & and '."}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();
            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.equal(unEncodedStringifiedTitle);
        });

        it("renders title as React component", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet title={"Dangerous <script> include"} />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            const titleComponent = head.title.toComponent();

            expect(titleComponent)
                .to.be.an("array")
                .that.has.lengthOf(1);

            titleComponent.forEach(title => {
                expect(title)
                    .to.be.an("object")
                    .that.contains.property("type", "title");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{titleComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedTitle}</div>`);
        });

        it("renders title with itemprop name as React component", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        title={"Title with Itemprop"}
                        titleAttributes={{itemprop: "name"}}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            const titleComponent = head.title.toComponent();

            expect(titleComponent)
                .to.be.an("array")
                .that.has.lengthOf(1);

            titleComponent.forEach(title => {
                expect(title)
                    .to.be.an("object")
                    .that.contains.property("type", "title");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{titleComponent}</div>
            );

            expect(markup.toLowerCase())
                .to.be.a("string")
                .that.equals(
                    `<div>${stringifiedTitleWithItemprop}</div>`.toLowerCase()
                );
        });

        it("renders base tag as React component", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        base={{target: "_blank", href: "http://localhost/"}}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toComponent");

            const baseComponent = head.base.toComponent();

            expect(baseComponent)
                .to.be.an("array")
                .that.has.lengthOf(1);

            baseComponent.forEach(base => {
                expect(base)
                    .to.be.an("object")
                    .that.contains.property("type", "base");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{baseComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedBaseTag}</div>`);
        });

        it("renders meta tags as React components", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        meta={[
                            {charset: "utf-8"},
                            {
                                name: "description",
                                content:
                                    "Test description & encoding of special characters like ' \" > < `"
                            },
                            {
                                "http-equiv": "content-type",
                                content: "text/html"
                            },
                            {property: "og:type", content: "article"},
                            {itemprop: "name", content: "Test name itemprop"}
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toComponent");

            const metaComponent = head.meta.toComponent();

            expect(metaComponent)
                .to.be.an("array")
                .that.has.lengthOf(5);

            metaComponent.forEach(meta => {
                expect(meta)
                    .to.be.an("object")
                    .that.contains.property("type", "meta");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{metaComponent}</div>
            );

            expect(markup.toLowerCase())
                .to.be.a("string")
                .that.equals(`<div>${stringifiedMetaTags}</div>`.toLowerCase());
        });

        it("renders link tags as React components", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        link={[
                            {href: "http://localhost/helmet", rel: "canonical"},
                            {
                                href: "http://localhost/style.css",
                                rel: "stylesheet",
                                type: "text/css"
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toComponent");

            const linkComponent = head.link.toComponent();

            expect(linkComponent)
                .to.be.an("array")
                .that.has.lengthOf(2);

            linkComponent.forEach(link => {
                expect(link)
                    .to.be.an("object")
                    .that.contains.property("type", "link");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{linkComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedLinkTags}</div>`);
        });

        it("renders script tags as React components", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        script={[
                            {
                                src: "http://localhost/test.js",
                                type: "text/javascript"
                            },
                            {
                                src: "http://localhost/test2.js",
                                type: "text/javascript"
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toComponent");

            const scriptComponent = head.script.toComponent();

            expect(scriptComponent)
                .to.be.an("array")
                .that.has.lengthOf(2);

            scriptComponent.forEach(script => {
                expect(script)
                    .to.be.an("object")
                    .that.contains.property("type", "script");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{scriptComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedScriptTags}</div>`);
        });

        it("renders noscript tags as React components", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        noscript={[
                            {
                                id: "foo",
                                innerHTML:
                                    '<link rel="stylesheet" type="text/css" href="/style.css" />'
                            },
                            {
                                id: "bar",
                                innerHTML:
                                    '<link rel="stylesheet" type="text/css" href="/style2.css" />'
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toComponent");

            const noscriptComponent = head.noscript.toComponent();

            expect(noscriptComponent)
                .to.be.an("array")
                .that.has.lengthOf(2);

            noscriptComponent.forEach(noscript => {
                expect(noscript)
                    .to.be.an("object")
                    .that.contains.property("type", "noscript");
            });

            const markup = ReactServer.renderToStaticMarkup(
                <div>{noscriptComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedNoscriptTags}</div>`);
        });

        it("renders style tags as React components", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        style={[
                            {
                                type: "text/css",
                                cssText: `body {background-color: green;}`
                            },
                            {
                                type: "text/css",
                                cssText: `p {font-size: 12px;}`
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toComponent");

            const styleComponent = head.style.toComponent();

            expect(styleComponent)
                .to.be.an("array")
                .that.has.lengthOf(2);

            const markup = ReactServer.renderToStaticMarkup(
                <div>{styleComponent}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${stringifiedStyleTags}</div>`);
        });

        it("renders title tag as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet title={"Dangerous <script> include"} />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString())
                .to.be.a("string")
                .that.equals(stringifiedTitle);
        });

        it("renders title with itemprop name as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        title={"Title with Itemprop"}
                        titleAttributes={{itemprop: "name"}}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            const titleString = head.title.toString();
            expect(titleString)
                .to.be.a("string")
                .that.equals(stringifiedTitleWithItemprop);
        });

        it("renders base tags as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        base={{target: "_blank", href: "http://localhost/"}}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");

            expect(head.base.toString())
                .to.be.a("string")
                .that.equals(stringifiedBaseTag);
        });

        it("renders meta tags as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        meta={[
                            {charset: "utf-8"},
                            {
                                name: "description",
                                content:
                                    "Test description & encoding of special characters like ' \" > < `"
                            },
                            {
                                "http-equiv": "content-type",
                                content: "text/html"
                            },
                            {property: "og:type", content: "article"},
                            {itemprop: "name", content: "Test name itemprop"}
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");

            expect(head.meta.toString())
                .to.be.a("string")
                .that.equals(stringifiedMetaTags);
        });

        it("renders link tags as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        link={[
                            {href: "http://localhost/helmet", rel: "canonical"},
                            {
                                href: "http://localhost/style.css",
                                rel: "stylesheet",
                                type: "text/css"
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");

            expect(head.link.toString())
                .to.be.a("string")
                .that.equals(stringifiedLinkTags);
        });

        it("renders script tags as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        script={[
                            {
                                src: "http://localhost/test.js",
                                type: "text/javascript"
                            },
                            {
                                src: "http://localhost/test2.js",
                                type: "text/javascript"
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");

            expect(head.script.toString())
                .to.be.a("string")
                .that.equals(stringifiedScriptTags);
        });

        it("renders style tags as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        style={[
                            {
                                type: "text/css",
                                cssText: `body {background-color: green;}`
                            },
                            {
                                type: "text/css",
                                cssText: `p {font-size: 12px;}`
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");

            expect(head.style.toString())
                .to.be.a("string")
                .that.equals(stringifiedStyleTags);
        });

        it("renders html attributes as component", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        htmlAttributes={{
                            lang: "ga",
                            className: "myClassName"
                        }}
                    />
                </HelmetProvider>,
                container
            );

            const {htmlAttributes} = store.renderStatic();
            const attrs = htmlAttributes.toComponent();

            expect(attrs).to.exist;

            const markup = ReactServer.renderToStaticMarkup(
                <html lang="en" {...attrs} />
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<html ${stringifiedHtmlAttributes}></html>`);
        });

        it("renders html attributes as string", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        htmlAttributes={{
                            lang: "ga",
                            class: "myClassName"
                        }}
                    />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");

            expect(head.htmlAttributes.toString())
                .to.be.a("string")
                .that.equals(stringifiedHtmlAttributes);
        });

        it("does not encode all characters with HTML character entity equivalents", () => {
            const chineseTitle = "膣膗 鍆錌雔";
            const stringifiedChineseTitle = `<title ${HELMET_ATTRIBUTE}="true">${chineseTitle}</title>`;

            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <div>
                        <Helmet title={chineseTitle} />
                    </div>
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString())
                .to.be.a("string")
                .that.equals(stringifiedChineseTitle);
        });

        it("rewind() provides a fallback object for empty Helmet state", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <div />
                </HelmetProvider>,
                container
            );

            const head = store.renderStatic();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");
            expect(head.htmlAttributes.toString()).to.equal("");
            expect(head.htmlAttributes).to.respondTo("toComponent");
            expect(head.htmlAttributes.toComponent()).to.be.an("object").that.is
                .empty;

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");
            expect(head.title.toString()).to.equal(
                `<title ${HELMET_ATTRIBUTE}="true"></title>`
            );
            expect(head.title).to.respondTo("toComponent");

            const markup = ReactServer.renderToStaticMarkup(
                <div>{head.title.toComponent()}</div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(
                    `<div><title ${HELMET_ATTRIBUTE}="true"></title></div>`
                );

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");
            expect(head.base.toString()).to.equal("");
            expect(head.base).to.respondTo("toComponent");
            expect(head.base.toComponent()).to.be.an("array").that.is.empty;

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");
            expect(head.meta.toString()).to.equal("");
            expect(head.meta).to.respondTo("toComponent");
            expect(head.meta.toComponent()).to.be.an("array").that.is.empty;

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");
            expect(head.link.toString()).to.equal("");
            expect(head.link).to.respondTo("toComponent");
            expect(head.link.toComponent()).to.be.an("array").that.is.empty;

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");
            expect(head.script.toString()).to.equal("");
            expect(head.script).to.respondTo("toComponent");
            expect(head.script.toComponent()).to.be.an("array").that.is.empty;

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toString");
            expect(head.noscript.toString()).to.equal("");
            expect(head.noscript).to.respondTo("toComponent");
            expect(head.noscript.toComponent()).to.be.an("array").that.is.empty;

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");
            expect(head.style.toString()).to.equal("");
            expect(head.style).to.respondTo("toComponent");
            expect(head.style.toComponent()).to.be.an("array").that.is.empty;
        });

        it("does not render undefined attribute values", () => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        script={[
                            {
                                src: "foo.js",
                                async: undefined
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            const {script} = store.renderStatic();
            const stringifiedScriptTag = script.toString();

            expect(stringifiedScriptTag)
                .to.be.a("string")
                .that.equals(
                    `<script ${HELMET_ATTRIBUTE}="true" src="foo.js" async></script>`
                );
        });
        after(() => {
            Helmet.canUseDOM = true;
        });
    });

    describe("misc", () => {
        it("lets you read current state in peek() whether or not a DOM is present", done => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet title={"Fancy title"} />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                expect(store.peek().title).to.be.equal("Fancy title");
                Helmet.canUseDOM = false;
                expect(store.peek().title).to.be.equal("Fancy title");
                Helmet.canUseDOM = true;

                done();
            });
        });

        it("encodes special characters", done => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        meta={[
                            {
                                name: "description",
                                content: 'This is "quoted" text and & and \'.'
                            }
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                const existingTags = headElement.querySelectorAll(
                    `meta[${HELMET_ATTRIBUTE}]`
                );
                const existingTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags)
                    .to.have.deep.nested.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(existingTag).to.have.property("getAttribute");
                expect(existingTag.getAttribute("name")).to.equal(
                    "description"
                );
                expect(existingTag.getAttribute("content")).to.equal(
                    'This is "quoted" text and & and \'.'
                );
                expect(existingTag.outerHTML).to.equal(
                    `<meta name="description" content="This is &quot;quoted&quot; text and &amp; and '." ${HELMET_ATTRIBUTE}="true">`
                );

                done();
            });
        });

        it("does not change the DOM if it recevies identical props", done => {
            const store = createHelmetStore();
            const spy = sinon.spy();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        meta={[
                            {name: "description", content: "Test description"}
                        ]}
                        title={"Test Title"}
                        onChangeClientState={spy}
                    />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                // Re-rendering will pass new props to an already mounted Helmet
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            meta={[
                                {
                                    name: "description",
                                    content: "Test description"
                                }
                            ]}
                            title={"Test Title"}
                            onChangeClientState={spy}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(spy.callCount).to.equal(1);

                    done();
                });
            });
        });

        it("does not write the DOM if the client and server are identical", done => {
            const store = createHelmetStore();
            headElement.innerHTML = `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript" />`;

            const spy = sinon.spy();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        script={[
                            {
                                src: "http://localhost/test.js",
                                type: "text/javascript"
                            }
                        ]}
                        onChangeClientState={spy}
                    />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                expect(spy.called).to.equal(true);

                const [, addedTags, removedTags] = spy.getCall(0).args;

                expect(addedTags).to.be.empty;
                expect(removedTags).to.be.empty;

                done();
            });
        });

        it("only adds new tags and preserves tags when rendering additional Helmet instances", done => {
            const store = createHelmetStore();
            const spy = sinon.spy();
            let addedTags;
            let removedTags;
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        link={[
                            {
                                href: "http://localhost/style.css",
                                rel: "stylesheet",
                                type: "text/css"
                            }
                        ]}
                        meta={[
                            {name: "description", content: "Test description"}
                        ]}
                        onChangeClientState={spy}
                    />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                expect(spy.called).to.equal(true);
                addedTags = spy.getCall(0).args[1];
                removedTags = spy.getCall(0).args[2];

                expect(addedTags).to.have.property("metaTags");
                expect(addedTags.metaTags).to.have.deep.nested.property("[0]");
                expect(addedTags.metaTags[0].outerHTML).to.equal(
                    `<meta name="description" content="Test description" data-react-helmet="true">`
                );
                expect(addedTags).to.have.property("linkTags");
                expect(addedTags.linkTags).to.have.deep.nested.property("[0]");
                expect(addedTags.linkTags[0].outerHTML).to.equal(
                    `<link href="http://localhost/style.css" rel="stylesheet" type="text/css" data-react-helmet="true">`
                );
                expect(removedTags).to.be.empty;

                // Re-rendering will pass new props to an already mounted Helmet
                ReactDOM.render(
                    <HelmetProvider store={store}>
                        <Helmet
                            link={[
                                {
                                    href: "http://localhost/style.css",
                                    rel: "stylesheet",
                                    type: "text/css"
                                },
                                {
                                    href: "http://localhost/style2.css",
                                    rel: "stylesheet",
                                    type: "text/css"
                                }
                            ]}
                            meta={[
                                {
                                    name: "description",
                                    content: "New description"
                                }
                            ]}
                            onChangeClientState={spy}
                        />
                    </HelmetProvider>,
                    container
                );

                requestAnimationFrame(() => {
                    expect(spy.callCount).to.equal(2);
                    addedTags = spy.getCall(1).args[1];
                    removedTags = spy.getCall(1).args[2];

                    expect(addedTags).to.have.property("metaTags");
                    expect(addedTags.metaTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.metaTags[0].outerHTML).to.equal(
                        `<meta name="description" content="New description" data-react-helmet="true">`
                    );
                    expect(addedTags).to.have.property("linkTags");
                    expect(addedTags.linkTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(addedTags.linkTags[0].outerHTML).to.equal(
                        `<link href="http://localhost/style2.css" rel="stylesheet" type="text/css" data-react-helmet="true">`
                    );
                    expect(removedTags).to.have.property("metaTags");
                    expect(removedTags.metaTags).to.have.deep.nested.property(
                        "[0]"
                    );
                    expect(removedTags.metaTags[0].outerHTML).to.equal(
                        `<meta name="description" content="Test description" data-react-helmet="true">`
                    );
                    expect(removedTags).to.not.have.property("linkTags");

                    done();
                });
            });
        });

        it("does not accept nested Helmets", done => {
            const store = createHelmetStore();
            const warn = sinon.stub(console, "warn");

            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet title={"Test Title"}>
                        <Helmet title={"Title you'll never see"} />
                    </Helmet>
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                expect(document.title).to.equal("Test Title");
                expect(warn.called).to.be.true;

                const [warning] = warn.getCall(0).args;
                expect(warning).to.equal(
                    "You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information."
                );

                warn.restore();
                done();
            });
        });

        it("recognizes valid tags regardless of attribute ordering", done => {
            const store = createHelmetStore();
            ReactDOM.render(
                <HelmetProvider store={store}>
                    <Helmet
                        meta={[
                            {content: "Test Description", name: "description"}
                        ]}
                    />
                </HelmetProvider>,
                container
            );

            requestAnimationFrame(() => {
                const existingTags = headElement.querySelectorAll(
                    `meta[${HELMET_ATTRIBUTE}]`
                );
                const existingTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags)
                    .to.have.deep.nested.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(existingTag).to.have.property("getAttribute");
                expect(existingTag.getAttribute("name")).to.equal(
                    "description"
                );
                expect(existingTag.getAttribute("content")).to.equal(
                    "Test Description"
                );
                expect(existingTag.outerHTML).to.equal(
                    `<meta content="Test Description" name="description" ${HELMET_ATTRIBUTE}="true">`
                );

                done();
            });
        });

        it("requestAnimationFrame works as expected", done => {
            requestAnimationFrame(cb => {
                expect(cb).to.exist;
                expect(cb).to.be.a("number");

                done();
            });
        });
    });
});
