const logJson = async () => {
    const reponse = await fetch('docs/meta.json');
    return await reponse.json();
}

(async () => {
    const meta = await logJson()
    document.querySelector("title").innerText= meta.name
    document.querySelector(".demo-name").innerText= meta.name
    if (meta.npm){
        document.querySelector(".npm").href="https://www.npmjs.com/package/" + meta.npm
        document.querySelector(".npm .title").innerText= meta.npm
    }else{
        document.querySelector(".npm").remove()
    }
    document.querySelector(".sources").href= meta.github
    document.querySelector(".readme-md").src= meta.github.replace("github.com","raw.githubusercontent.com") + "HEAD/README.md"
    if (meta.moreInfo){
        document.querySelector(".moreInfo").innerText= meta.moreInfo
    }
})()


