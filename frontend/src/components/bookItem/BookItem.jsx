const BookItem = () => {
    const title = "100 años de soledad";
    const author = "Gabriel García Marquez";
    const rating = 5;
    const pageCount = 342;

    return (
        <div>
            <h2>{title}</h2>
            <h3>{author}</h3>
            <div>{rating} estrellas</div>
            <p>{pageCount} páginas</p>
        </div>
    )
}

export default BookItem