package fu.se.a2vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "NewsArticle")
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID")
    private String newsArticleId;

    @NotBlank(message = "Tiêu đề bài viết không được để trống")
    @Column(name = "NewsTitle")
    private String newsTitle;

    @NotBlank(message = "Headline không được để trống")
    @Column(name = "Headline", nullable = false)
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    @Column(name = "NewsContent")
    private String newsContent;

    @Column(name = "NewsSource")
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @Column(name = "NewsStatus")
    private Boolean newsStatus = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @Column(name = "UpdatedByID")
    private Short updatedById;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private Set<Tag> tags = new HashSet<>();

    public NewsArticle() {
    }

    public String getNewsArticleId() {
        return newsArticleId;
    }

    public void setNewsArticleId(String newsArticleId) {
        this.newsArticleId = newsArticleId;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // Trả về 1 (Active) hoặc 0 (Inactive) đúng theo đề bài
    public Integer getNewsStatus() {
        return Boolean.TRUE.equals(newsStatus) ? 1 : 0;
    }

    public void setNewsStatus(Object status) {
        if (status instanceof Boolean b) {
            this.newsStatus = b;
        } else if (status instanceof Number n) {
            this.newsStatus = n.intValue() == 1;
        } else if (status instanceof String s) {
            this.newsStatus = "1".equals(s.trim()) || "true".equalsIgnoreCase(s.trim());
        } else {
            this.newsStatus = true;
        }
    }

    public SystemAccount getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(SystemAccount createdBy) {
        this.createdBy = createdBy;
    }

    public Short getUpdatedById() {
        return updatedById;
    }

    public void setUpdatedById(Short updatedById) {
        this.updatedById = updatedById;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
