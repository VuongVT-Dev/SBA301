// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.controller;

import fu.se.a2vuongvt_ce191082.entity.NewsArticle;
import fu.se.a2vuongvt_ce191082.service.NewsArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    // Public endpoint: không cần đăng nhập, chỉ lấy các bài viết có NewsStatus = 1 (Active)
    @GetMapping("/public")
    public ResponseEntity<List<NewsArticle>> getPublicActiveNews(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(newsArticleService.getActiveNews(search));
    }

    // Staff endpoint: lấy toàn bộ bài viết (hoặc tìm kiếm)
    @GetMapping
    public ResponseEntity<List<NewsArticle>> getAllNews(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(newsArticleService.getAllNews(search));
    }

    // Staff endpoint: xem lịch sử bài viết do chính Staff đó tạo
    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<NewsArticle>> getNewsHistory(@PathVariable Short accountId) {
        return ResponseEntity.ok(newsArticleService.getNewsByCreator(accountId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticle> getNewsById(@PathVariable String id) {
        return ResponseEntity.ok(newsArticleService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticle> createNews(@RequestBody NewsArticleRequest request) {
        validateRequest(request);
        NewsArticle article = new NewsArticle();
        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent().trim());
        article.setNewsSource(request.getNewsSource() != null ? request.getNewsSource().trim() : "FPT University");
        article.setNewsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : 1);

        NewsArticle saved = newsArticleService.createNews(
                article,
                request.getCategoryId(),
                request.getCreatedById(),
                request.getTagIds()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticle> updateNews(@PathVariable String id, @RequestBody NewsArticleRequest request) {
        validateRequest(request);
        NewsArticle article = new NewsArticle();
        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent().trim());
        article.setNewsSource(request.getNewsSource() != null ? request.getNewsSource().trim() : "FPT University");
        article.setNewsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : 1);

        NewsArticle updated = newsArticleService.updateNews(
                id,
                article,
                request.getCategoryId(),
                request.getUpdatedById(),
                request.getTagIds()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNews(@PathVariable String id) {
        newsArticleService.deleteNews(id);
        return ResponseEntity.ok(Map.of("message", "Xóa bài viết thành công!"));
    }

    private void validateRequest(NewsArticleRequest request) {
        if (request.getNewsTitle() == null || request.getNewsTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề bài viết (NewsTitle) không được để trống!");
        }
        if (request.getHeadline() == null || request.getHeadline().trim().isEmpty()) {
            throw new IllegalArgumentException("Headline không được để trống!");
        }
        if (request.getNewsContent() == null || request.getNewsContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung bài viết (NewsContent) không được để trống!");
        }
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn danh mục (Category)!");
        }
    }

    public static class NewsArticleRequest {
        private String newsTitle;
        private String headline;
        private String newsContent;
        private String newsSource;
        private Short categoryId;
        private Integer newsStatus;
        private Short createdById;
        private Short updatedById;
        private List<Integer> tagIds;

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

        public String getNewsContent() {
            return newsContent;
        }

        public void setNewsContent(String newsContent) {
            this.newsTitle = this.newsTitle;
            this.newsContent = newsContent;
        }

        public String getNewsSource() {
            return newsSource;
        }

        public void setNewsSource(String newsSource) {
            this.newsSource = newsSource;
        }

        public Short getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Short categoryId) {
            this.categoryId = categoryId;
        }

        public Integer getNewsStatus() {
            return newsStatus;
        }

        public void setNewsStatus(Integer newsStatus) {
            this.newsStatus = newsStatus;
        }

        public Short getCreatedById() {
            return createdById;
        }

        public void setCreatedById(Short createdById) {
            this.createdById = createdById;
        }

        public Short getUpdatedById() {
            return updatedById;
        }

        public void setUpdatedById(Short updatedById) {
            this.updatedById = updatedById;
        }

        public List<Integer> getTagIds() {
            return tagIds;
        }

        public void setTagIds(List<Integer> tagIds) {
            this.tagIds = tagIds;
        }
    }
}
