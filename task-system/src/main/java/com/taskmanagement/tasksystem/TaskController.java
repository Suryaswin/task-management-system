package com.taskmanagement.tasksystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        System.out.println("Current username: " + username);
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("User not found for username: " + username);
            throw new RuntimeException("User not found");
        }
        System.out.println("User ID: " + user.getId());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
        @RequestParam(required = false) String priority,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size) {
        Long userId = getCurrentUserId();
        List<Task> allTasks = taskRepository.findByUserId(userId);
        System.out.println("Tasks for user " + userId + ": " + allTasks.size());
        if (priority != null && !priority.isEmpty()) {
            allTasks = allTasks.stream()
                    .filter(task -> task.getPriority().equalsIgnoreCase(priority))
                    .collect(Collectors.toList());
        }
        int start = Math.min(page * size, allTasks.size());
        int end = Math.min((page + 1) * size, allTasks.size());
        List<Task> paginatedTasks = allTasks.subList(start, end);
        return ResponseEntity.ok(paginatedTasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(task.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Long userId = getCurrentUserId();
        task.setUserId(userId);
        System.out.println("Creating task for user " + userId + ": " + task.getTitle());
        Task savedTask = taskRepository.save(task);
        System.out.println("Saved task ID: " + savedTask.getId());
        return savedTask;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Long userId = getCurrentUserId();
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUserId().equals(userId)) {
            Task existingTask = task.get();
            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setPriority(updatedTask.getPriority());
            return ResponseEntity.ok(taskRepository.save(existingTask));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (taskRepository.existsById(id) && taskRepository.findById(id).get().getUserId().equals(userId)) {
            taskRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}