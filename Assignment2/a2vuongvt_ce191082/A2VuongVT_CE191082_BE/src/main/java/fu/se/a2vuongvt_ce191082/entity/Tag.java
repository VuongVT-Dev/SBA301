package fu.se.a2vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "Tag")
public class Tag {

    @Id
    @Column(name = "TagID")
    private Integer tagId;

    @NotBlank(message = "Tên Tag không được để trống")
    @Column(name = "TagName")
    private String tagName;

    @Column(name = "Note")
    private String note;

    public Tag() {
    }

    public Tag(Integer tagId, String tagName, String note) {
        this.tagId = tagId;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
