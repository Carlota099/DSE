import { useState, useEffect } from "react";
import "./Tips.css";

const Tips = ({ state }) => {
    const { contract } = state;
    const [tips, setTips] = useState([
        {
            name: "Carlota",
            message: "You are the best!",
            timestamp: 1716912437, // Tiempo actual en segundos
            from: "0xE1A85eEa6a2171753Def7f811a7FF16717a5E937"
        },
        {
            name: "Claudia",
            message: "I love your job",
            timestamp: 1716840606, // Tiempo actual en segundos
            from: "0xE1A85eEa6a2171753Def7f811a7FF16717a5E937"
        },
        {
            name: "Hugo",
            message: "Hello from France!",
            timestamp: 1716840722, // Tiempo actual en segundos
            from: "0xE1A85eEa6a2171753Def7f811a7FF16717a5E937"
        }
    ]);

    useEffect(() => {
        const fetchTips = async () => {
            if (contract) {
                const contractTips = await contract.getTips();
                setTips([...contractTips, ...tips]);
            }
        };
        fetchTips();
    }, [contract]);

    return (
        <div className="container-fluid">
            <h3 style={{ textAlign: "center", marginTop: "20px" }}>Messages</h3>
            <table>
                <tbody>
                    {tips.map((tip, index) => (
                        <tr key={index}>
                            <td
                                style={{
                                    backgroundColor: "dodgerblue",
                                    border: "1px solid white",
                                    borderCollapse: "collapse",
                                    padding: "7px",
                                    width: "100px",
                                    color: "white",
                                }}
                            >
                                {tip.name}
                            </td>
                            <td
                                style={{
                                    backgroundColor: "dodgerblue",
                                    border: "1px solid white",
                                    borderCollapse: "collapse",
                                    padding: "7px",
                                    width: "800px",
                                    color: "white",
                                }}
                            >
                                {new Date(tip.timestamp * 1000).toLocaleString()}
                            </td>
                            <td
                                style={{
                                    backgroundColor: "dodgerblue",
                                    border: "1px solid white",
                                    borderCollapse: "collapse",
                                    padding: "7px",
                                    width: "300px",
                                    color: "white",
                                }}
                            >
                                {tip.message}
                            </td>
                            <td
                                className="container-fluid"
                                style={{
                                    backgroundColor: "dodgerblue",
                                    border: "1px solid white",
                                    borderCollapse: "collapse",
                                    padding: "7px",
                                    width: "400px",
                                    color: "white",
                                }}
                            >
                                {tip.from}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tips;
