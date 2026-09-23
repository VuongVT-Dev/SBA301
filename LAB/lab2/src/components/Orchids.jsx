import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import useOrchids from '../hooks/useOrchids';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import OrchidCard from './OrchidCard';
import OrchidDetailModal from './OrchidDetailModal';
import SearchBox from './SearchBox';
import CategoryFilter from './CategoryFilter';

export default function Orchids() {
    const { orchids, loading, error, reload } = useOrchids();
    const [show, setShow] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState(null);

    // Derived view state (Bước 23)
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('ALL');
    const [specialOnly, setSpecialOnly] = useState(false);

    const handleShow = (orchid) => { setSelectedOrchid(orchid); setShow(true); };
    const handleClose = () => { setShow(false); setSelectedOrchid(null); };

    const categories = Array.from(new Set(orchids.map((o) => o.category))).filter(Boolean);

    const visibleOrchids = orchids.filter((o) => {
        const matchName = o.orchidName.toLowerCase().includes(keyword.trim().toLowerCase());
        const matchCategory = category === 'ALL' || o.category === category;
        const matchSpecial = !specialOnly || o.isSpecial;
        return matchName && matchCategory && matchSpecial;
    });

    return (
        <Container id="orchids" className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Orchids List</h2>
                <Button variant="outline-primary" onClick={reload} disabled={loading}>Reload</Button>
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={reload} />}

            {!loading && !error && orchids.length === 0 && <p>Không có Orchid nào.</p>}

            {!loading && !error && orchids.length > 0 && (
                <>
                    <div className="bg-white p-3 rounded shadow-sm mb-4">
                        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center">
                            <SearchBox keyword={keyword} onKeywordChange={setKeyword} />
                            <CategoryFilter
                                categories={categories}
                                selectedCategory={category}
                                onCategoryChange={setCategory}
                                specialOnly={specialOnly}
                                onSpecialOnlyChange={setSpecialOnly}
                            />
                        </div>
                    </div>

                    {visibleOrchids.length === 0 ? (
                        <div className="alert alert-info">Không tìm thấy hoa lan nào phù hợp với bộ lọc.</div>
                    ) : (
                        <Row>
                            {visibleOrchids.map((orchid) => (
                                <Col xs={12} sm={6} lg={3} key={orchid.id} className="mb-4">
                                    <OrchidCard orchid={orchid} onDetail={handleShow} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}

            <OrchidDetailModal show={show} orchid={selectedOrchid} onClose={handleClose} />
        </Container>
    );
}