"""Calculadora interativa com menu e tratamento de erros."""


def ler_numero(mensagem):
    """Lê um número, aceitando vírgula ou ponto como separador decimal."""
    while True:
        texto = input(mensagem).strip().replace(",", ".")
        try:
            return float(texto)
        except ValueError:
            print("Entrada inválida. Digite um número, por exemplo 12.5.")


def escolher_operacao():
    print("\nOperações disponíveis:")
    print("  1 - Somar")
    print("  2 - Subtrair")
    print("  3 - Multiplicar")
    print("  4 - Dividir")

    while True:
        opcao = input("Escolha uma opção (1-4): ").strip()
        if opcao in {"1", "2", "3", "4"}:
            return opcao
        print("Opção inválida. Digite 1, 2, 3 ou 4.")


def calcular(a, b, opcao):
    if opcao == "1":
        return a + b
    if opcao == "2":
        return a - b
    if opcao == "3":
        return a * b
    if b == 0:
        return None
    return a / b


def formatar(valor):
    if valor is None:
        return "não é possível dividir por zero"
    if valor == int(valor):
        return str(int(valor))
    return f"{valor:.4f}".rstrip("0").rstrip(".")


print("=" * 46)
print("  Calculadora Python")
print("=" * 46)

while True:
    opcao = escolher_operacao()
    a = ler_numero("\nPrimeiro número: ")
    b = ler_numero("Segundo número: ")

    resultado = calcular(a, b, opcao)
    print(f"Resultado: {formatar(resultado)}")

    continuar = input("\nCalcular de novo? (s/n): ").strip().lower()
    if continuar not in {"s", "sim", "y"}:
        print("Até a próxima!")
        break
