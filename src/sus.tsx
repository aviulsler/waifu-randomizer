import {useEffect, useState} from "react";

interface WaifuResponse {
    url: string;
}

const WaifuSelector = () => {
    const types = ["sfw", "nsfw"]; // Example types
    const sfwCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];
    const nsfwCategories = ["waifu", "neko", "trap", "blowjob"];
    const [searchCategoriesSfw, setSearchCategoriesSfw] = useState<string[]>([]);
    const [searchCategoriesNsfw, setSearchCategoriesNsfw] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [result, setResult] = useState<WaifuResponse | null>(null);
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!selectedType || !selectedCategory) {
            alert("Please select both a type and a category.");
            return;
        }

        const isFromSfw = sfwCategories.includes(selectedCategory) || searchCategoriesSfw.includes(selectedCategory);
        const isFromNsfw = nsfwCategories.includes(selectedCategory) || searchCategoriesNsfw.includes(selectedCategory);

        try {
            let response;

            if (isFromSfw || isFromNsfw) {
                if (searchCategoriesSfw.includes(selectedCategory) || searchCategoriesNsfw.includes(selectedCategory)) {
                    const queryParams = new URLSearchParams({
                        included_tags: selectedCategory,
                        is_nsfw: isFromNsfw ? "true" : "false",
                    });

                    response = await fetch(`https://api.waifu.im/search?${queryParams}`);
                } else {
                    response = await fetch(`https://api.waifu.pics/${selectedType}/${selectedCategory}`);
                }
            } else {
                throw new Error("Invalid category selection.");
            }

            if (!response.ok) {
                throw new Error("Failed to fetch waifu data");
            }

            const result = await response.json();
            console.log(result);
            if (result.images) {
                setResult({ url: result.images[0]?.url });
            } else if (result.url) {
                setResult({ url: result.url });
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.waifu.im/tags');
                const data = await response.json();
                setSearchCategoriesSfw(data.versatile);
                setSearchCategoriesNsfw(data.nsfw)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetch function
    }, []);

    return (
        <div>
            <h1>Waifu Randomizer</h1>

            <label htmlFor="type">Type:</label>
            <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="" disabled>
                    Select Type
                </option>
                {types.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            <label htmlFor="category">Category:</label>
            <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="" disabled>
                    Select Category
                </option>
                {selectedType === "sfw"
                    ? (sfwCategories.concat(searchCategoriesSfw)).map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))
                    : (nsfwCategories.concat(searchCategoriesNsfw)).map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
            </select>

            <input style={{display: "none"}}
                onKeyDown={handleKeyPress} // Listen for Enter key press
            />
            {/* Submit Button */}
            <button onClick={handleSubmit}>Submit</button>

            {/* Display the Result */}
            {result && (
                <div>
                    <h2>Result:</h2>
                    <img src={result.url} alt="Waifu" style={{maxWidth: "60vw", maxHeight: "60vh"}}/>
                </div>
            )}
        </div>
    );
};

export default WaifuSelector;
