export default function StatsCard({ title, value ,image}) {
    return (
        <div className="card text-left p-4 shadow-lg">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title text-primary">{title}</h5>
                    <span className="card-title text-primary">{image}</span>

                </div>
                <p className="card-text fs-7 ">{value}</p>
            </div>
        </div>
    );
}