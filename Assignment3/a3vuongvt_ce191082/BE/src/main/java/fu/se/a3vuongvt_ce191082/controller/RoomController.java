// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.controller;

import fu.se.a3vuongvt_ce191082.entity.RoomInformation;
import fu.se.a3vuongvt_ce191082.entity.RoomType;
import fu.se.a3vuongvt_ce191082.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Public: Xem danh sách phòng không cần đăng nhập
    @GetMapping("/rooms/public")
    public ResponseEntity<List<RoomInformation>> getPublicRooms(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer roomTypeId
    ) {
        return ResponseEntity.ok(roomService.getPublicRooms(search, roomTypeId));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomInformation>> getAllRooms(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(roomService.getAllRooms(search));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomInformation> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomInformation> createRoom(@RequestBody RoomRequest request) {
        RoomInformation room = new RoomInformation();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomPricePerDay(request.getRoomPricePerDay());
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : 1);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomService.createRoom(room, request.getRoomTypeId()));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomInformation> updateRoom(@PathVariable Integer id, @RequestBody RoomRequest request) {
        RoomInformation room = new RoomInformation();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomPricePerDay(request.getRoomPricePerDay());
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : 1);
        return ResponseEntity.ok(roomService.updateRoom(id, room, request.getRoomTypeId()));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.deleteRoom(id));
    }

    @GetMapping("/room-types")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }

    @PostMapping("/room-types")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoomType(roomType));
    }

    public static class RoomRequest {
        private String roomNumber;
        private String roomDetailDescription;
        private Integer roomMaxCapacity;
        private Integer roomTypeId;
        private Integer roomStatus;
        private BigDecimal roomPricePerDay;

        public String getRoomNumber() {
            return roomNumber;
        }

        public void setRoomNumber(String roomNumber) {
            this.roomNumber = roomNumber;
        }

        public String getRoomDetailDescription() {
            return roomDetailDescription;
        }

        public void setRoomDetailDescription(String roomDetailDescription) {
            this.roomDetailDescription = roomDetailDescription;
        }

        public Integer getRoomMaxCapacity() {
            return roomMaxCapacity;
        }

        public void setRoomMaxCapacity(Integer roomMaxCapacity) {
            this.roomMaxCapacity = roomMaxCapacity;
        }

        public Integer getRoomTypeId() {
            return roomTypeId;
        }

        public void setRoomTypeId(Integer roomTypeId) {
            this.roomTypeId = roomTypeId;
        }

        public Integer getRoomStatus() {
            return roomStatus;
        }

        public void setRoomStatus(Integer roomStatus) {
            this.roomStatus = roomStatus;
        }

        public BigDecimal getRoomPricePerDay() {
            return roomPricePerDay;
        }

        public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
            this.roomPricePerDay = roomPricePerDay;
        }
    }
}
