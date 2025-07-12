import re

index_path = "/opt/buntudelice-242/src/pages/Index.tsx"

with open(index_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

in_return = False
new_lines = []
for line in lines:
    # Détecter le début du return JSX
    if "return (" in line:
        in_return = True
        new_lines.append(line)
        continue
    # Détecter la fin du return JSX
    if in_return and line.strip() == ")":
        in_return = False
        new_lines.append(line)
        continue
    # Si on est dans le return, commenter les lignes de sous-composants (sauf le conteneur principal)
    if in_return and re.match(r"\s*<\w", line) and not re.match(r"\s*<div", line):
        new_lines.append("//" + line)
    else:
        new_lines.append(line)

with open(index_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Tous les sous-composants du return de Index.tsx ont été commentés.") 