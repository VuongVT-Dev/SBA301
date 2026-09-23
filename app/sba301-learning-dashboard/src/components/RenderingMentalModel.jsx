const steps = ["index.html", "main.jsx", "App", "Components", "JSX", "Browser"];

function RenderingMentalModel() {
    return (
        <section className="card card-full">
            <h2>React Rendering Mental Model</h2>
            <div className="mental-model-flow">
                {steps.map((step, index) => (
                    <span key={step} className="flow-group">
                        <span className="flow-step">{step}</span>
                        {index < steps.length - 1 && (
                            <span className="flow-arrow">→</span>
                        )}
                    </span>
                ))}
            </div>
        </section>
    );
}

export default RenderingMentalModel;
