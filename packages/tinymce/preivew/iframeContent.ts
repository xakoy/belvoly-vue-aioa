// import { Editor } from 'tinymce'

const getPreviewHtml = (content: string) => {
    let headHtml = ''
    const encode = str => str
    // const encode = editor.dom.encode
    // const contentStyle = Settings.getContentStyle(editor)

    // headHtml += '<base href="' + encode(editor.documentBaseURI.getURI()) + '">'

    // const cors = Settings.shouldUseContentCssCors(editor) ? ' crossorigin="anonymous"' : ''
    // Tools.each(editor.contentCSS, url => {
    //     headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '"' + cors + '>'
    // })

    // if (contentStyle) {
    //     headHtml += '<style type="text/css">' + contentStyle + '</style>'
    // }
    const contentStyle = `html,body { padding: 0; margin: 0}`
    headHtml += '<style type="text/css">' + contentStyle + '</style>'

    // const bodyId = Settings.getBodyId(editor)
    const bodyId = 'bodyId1'

    // const bodyClass = Settings.getBodyClass(editor)
    const bodyClass = 'bodyClass1'

    // const isMetaKeyPressed = Env.mac ? 'e.metaKey' : 'e.ctrlKey && !e.altKey'

    // const preventClicksOnLinksScript =
    //     '<script>' +
    //     'document.addEventListener && document.addEventListener("click", function(e) {' +
    //     'for (var elm = e.target; elm; elm = elm.parentNode) {' +
    //     'if (elm.nodeName === "A" && !(' +
    //     isMetaKeyPressed +
    //     ')) {' +
    //     'e.preventDefault();' +
    //     '}' +
    //     '}' +
    //     '}, false);' +
    //     '</script> '

    // const directionality = editor.getBody().dir
    // const dirAttr = directionality ? ' dir="' + encode(directionality) + '"' : ''

    const previewHtml =
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        headHtml +
        '</head>' +
        '<body id="' +
        encode(bodyId) +
        '" class="mce-content-body ' +
        encode(bodyClass) +
        '"' +
        // dirAttr +
        '>' +
        content +
        // preventClicksOnLinksScript +
        '</body>' +
        '</html>'

    return previewHtml
}

export { getPreviewHtml }
