package fu.se.a2vuongvt_ce191082.service;

import fu.se.a2vuongvt_ce191082.entity.Tag;
import fu.se.a2vuongvt_ce191082.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAllTags(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return tagRepository.findByTagNameContainingIgnoreCase(keyword.trim());
        }
        return tagRepository.findAll();
    }

    public Tag getTagById(Integer id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Tag với ID: " + id));
    }

    public Tag createTag(Tag tag) {
        if (tag.getTagId() == null) {
            int nextId = tagRepository.findAll().stream()
                    .mapToInt(t -> t.getTagId() != null ? t.getTagId() : 0)
                    .max()
                    .orElse(0) + 1;
            tag.setTagId(nextId);
        }
        return tagRepository.save(tag);
    }

    public Tag updateTag(Integer id, Tag updated) {
        Tag existing = getTagById(id);
        existing.setTagName(updated.getTagName());
        existing.setNote(updated.getNote());
        return tagRepository.save(existing);
    }

    public void deleteTag(Integer id) {
        Tag existing = getTagById(id);
        tagRepository.delete(existing);
    }
}
