"""Boas-vindas interativas: variáveis, input() e f-strings."""

print("=" * 46)
print("  Olá, Python! Primeiro contato no terminal")
print("=" * 46)

nome = input("Qual é o seu nome? ").strip()

while not nome:
    print("O nome não pode ficar vazio.")
    nome = input("Qual é o seu nome? ").strip()

idade_texto = input("Quantos anos você tem? ").strip()

try:
    idade = int(idade_texto)
except ValueError:
    print(f"\nSem problemas, {nome}. Não consegui ler a idade como número.")
else:
    print(f"\nOlá, {nome}! Você tem {idade} anos.")
    print(f"Em 10 anos você terá {idade + 10} anos.")

letras = len(nome.replace(" ", ""))
print(f"Seu nome tem {letras} letra(s), sem contar os espaços.")
print("\nFim do primeiro programa. Execute de novo com outros dados!")
