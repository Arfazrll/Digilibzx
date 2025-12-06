package com.digilibz.dto.review;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewContent {
    private String authorId;
    private int rating;
    private String content;

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}