package fu.se.a2vuongvt_ce191082.controller;

import fu.se.a2vuongvt_ce191082.entity.Tag;
import fu.se.a2vuongvt_ce191082.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(tagService.getAllTags(search));
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@Valid @RequestBody Tag tag) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.createTag(tag));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Integer id, @Valid @RequestBody Tag tag) {
        return ResponseEntity.ok(tagService.updateTag(id, tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTag(@PathVariable Integer id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok(Map.of("message", "Xóa Tag thành công!"));
    }
}
