package com.digilibz.dto.review;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewRequest {
    private String bookId;
    private ReviewContent review;

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public ReviewContent getReview() {
        return review;
    }

    public void setReview(ReviewContent review) {
        this.review = review;
    }
}