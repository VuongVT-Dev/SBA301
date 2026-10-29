package fu.se.a2vuongvt_ce191082.service;

import fu.se.a2vuongvt_ce191082.entity.Category;
import fu.se.a2vuongvt_ce191082.entity.NewsArticle;
import fu.se.a2vuongvt_ce191082.entity.SystemAccount;
import fu.se.a2vuongvt_ce191082.entity.Tag;
import fu.se.a2vuongvt_ce191082.repository.CategoryRepository;
import fu.se.a2vuongvt_ce191082.repository.NewsArticleRepository;
import fu.se.a2vuongvt_ce191082.repository.SystemAccountRepository;
import fu.se.a2vuongvt_ce191082.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(
            NewsArticleRepository newsArticleRepository,
            CategoryRepository categoryRepository,
            SystemAccountRepository accountRepository,
            TagRepository tagRepository
    ) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    public List<NewsArticle> getActiveNews(String keyword) {
        List<NewsArticle> activeList = newsArticleRepository.findByNewsStatusOrderByCreatedDateDesc(true);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim().toLowerCase();
            return activeList.stream()
                    .filter(n -> (n.getNewsTitle() != null && n.getNewsTitle().toLowerCase().contains(kw))
                            || (n.getHeadline() != null && n.getHeadline().toLowerCase().contains(kw)))
                    .collect(Collectors.toList());
        }
        return activeList;
    }

    public List<NewsArticle> getAllNews(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            return newsArticleRepository.findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(kw, kw);
        }
        return newsArticleRepository.findAll();
    }

    public List<NewsArticle> getNewsByCreator(Short accountId) {
        return newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(accountId);
    }

    public NewsArticle getNewsById(String id) {
        return newsArticleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài viết với ID: " + id));
    }

    public NewsArticle createNews(NewsArticle article, Short categoryId, Short createdById, List<Integer> tagIds) {
        if (article.getNewsArticleId() == null || article.getNewsArticleId().trim().isEmpty()) {
            int maxNumericId = newsArticleRepository.findAll().stream()
                    .mapToInt(n -> {
                        try {
                            return Integer.parseInt(n.getNewsArticleId().trim());
                        } catch (Exception e) {
                            return 0;
                        }
                    })
                    .max()
                    .orElse(0);
            article.setNewsArticleId(String.valueOf(maxNumericId + 1));
        }
        article.setCreatedDate(LocalDateTime.now());
        article.setModifiedDate(LocalDateTime.now());
        if (article.getNewsStatus() == null) {
            article.setNewsStatus(1);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại!"));
            article.setCategory(category);
        }
        if (createdById != null) {
            SystemAccount creator = accountRepository.findById(createdById)
                    .orElseThrow(() -> new IllegalArgumentException("Tài khoản người tạo không tồn tại!"));
            article.setCreatedBy(creator);
            article.setUpdatedById(createdById);
        }
        if (tagIds != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
            article.setTags(tags);
        }
        return newsArticleRepository.save(article);
    }

    public NewsArticle updateNews(String id, NewsArticle updated, Short categoryId, Short updatedById, List<Integer> tagIds) {
        NewsArticle existing = getNewsById(id);
        existing.setNewsTitle(updated.getNewsTitle());
        existing.setHeadline(updated.getHeadline());
        existing.setNewsContent(updated.getNewsContent());
        existing.setNewsSource(updated.getNewsSource());
        if (updated.getNewsStatus() != null) {
            existing.setNewsStatus(updated.getNewsStatus());
        }
        existing.setModifiedDate(LocalDateTime.now());
        if (updatedById != null) {
            existing.setUpdatedById(updatedById);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại!"));
            existing.setCategory(category);
        }
        if (tagIds != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
            existing.setTags(tags);
        }
        return newsArticleRepository.save(existing);
    }

    public void deleteNews(String id) {
        NewsArticle existing = getNewsById(id);
        existing.getTags().clear();
        newsArticleRepository.save(existing);
        newsArticleRepository.delete(existing);
    }
}
