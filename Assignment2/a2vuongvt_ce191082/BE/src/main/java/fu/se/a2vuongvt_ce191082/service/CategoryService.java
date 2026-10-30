// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.service;

import fu.se.a2vuongvt_ce191082.entity.Category;
import fu.se.a2vuongvt_ce191082.repository.CategoryRepository;
import fu.se.a2vuongvt_ce191082.repository.NewsArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryService(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public List<Category> getAllCategories(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            return categoryRepository.findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(kw, kw);
        }
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với ID: " + id));
    }

    public Category createCategory(Category category) {
        if (category.getIsActive() == null) {
            category.setIsActive(1);
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Short id, Category updated) {
        Category existing = getCategoryById(id);
        existing.setCategoryName(updated.getCategoryName());
        existing.setCategoryDescription(updated.getCategoryDescription());
        existing.setParentCategoryId(updated.getParentCategoryId());
        if (updated.getIsActive() != null) {
            existing.setIsActive(updated.getIsActive());
        }
        return categoryRepository.save(existing);
    }

    public void deleteCategory(Short id) {
        Category existing = getCategoryById(id);
        if (newsArticleRepository.existsByCategory_CategoryId(existing.getCategoryId())) {
            throw new IllegalStateException("Không thể xóa danh mục này vì đã có bài viết (NewsArticle) thuộc danh mục này!");
        }
        categoryRepository.delete(existing);
    }
}
