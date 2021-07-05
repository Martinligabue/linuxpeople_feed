search_field = document.querySelector("header input[type='search']"),
    body = document.querySelector("body"),
    header = document.querySelector("header"),
    search_results_container = document.querySelector("header form > div"),
    search_results = document.querySelector("header form > div > div"),
    search_result = document.querySelector("header form > div > div article"),
    search_keywords = "";


var taglist_tmp = [];
var posts = [];

fetch('https://feed.linuxpeople.org/search.json')
    .then(res => res.json())
    .then((posts) => {
        console.info("linuepeople posts index found.");

        function search() 
        {
            term = search_field.value.toLowerCase();
            search_results.innerHTML = "",
            body.style.overflow = "hidden";

            if(term.length < 3) {return false}

            console.log(`Searching for ${term}`)
            if (!header.classList.contains("typing"))
            {
                header.classList.add("typing")
            }

            window.scrollTo(0, 0);

            let results = [],
                terms = term.trim().split(" "),
                regex_string = "";

            terms.forEach(t => {
                if(t != " ") {
                    regex_string += `(?=.*${t})`
                }
            });

            regex_string = `${regex_string}.*`;

            for (var i=0 ; i < posts.length ; i++)
            {
                let matches = posts[i]["title"].toLowerCase().match(regex_string);
                if (matches != null) 
                {
                    results.push(posts[i]);
                }
            }

            results.forEach(result => {
                var post = document.createElement("article");
                post.innerHTML = `
                    <a href="${result["url"]}">
                        <h2>${result["title"]}</h2>
                    </a>
                    <br />
                    <p>${result["excerpt"]}</p>
                `;
                search_results.appendChild(post);
            });
            search_results_container.style.display = "block";
        }
        search_field.addEventListener("keyup", search);
    })
    .catch(err => 
    {
        console.error("Failed to fetch linuxpeople posts index!");
        throw err
    });

window.addEventListener('mouseup', e => {
    if(e.target.tagName == "DIV") {
        search_results_container.style.display = "none",
            search_results.innerHTML = "",
            body.style.overflow = "auto",
            search_field.value = "",
            header.classList.remove("typing");
    }
});