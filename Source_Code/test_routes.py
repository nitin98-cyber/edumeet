from app import app

print("Registered Routes:")
print("-" * 50)
for rule in app.url_map.iter_rules():
    print(f"{rule.endpoint:30s} -> {rule.rule}")
