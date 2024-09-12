import React, { useEffect } from "react";

const MyComponent: React.FC = () => {
    useEffect(() => {
        const button = document.querySelector("button");

        if (button) {
            button.addEventListener("click", async () => {
                try {
                    const response = await fetch("http://localhost:3000/create-checkout-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            items: [
                                { id: 1, quantity: 3 },
                            ],
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error);
                    }

                    const { url } = await response.json();
                    window.location.href = url;
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }, []);

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <script src="script.js" defer></script>
            </head>
            <body>
                <button>Checkout</button>
            </body>
        </html>
    );
};

export default MyComponent;
