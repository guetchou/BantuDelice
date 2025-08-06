#!/bin/bash

echo "🧪 Test de l'API MTN Mobile Money"
echo "=================================="

# Configuration
API_URL="http://localhost:3001/api"
TEST_PHONE="242064352209"
TEST_AMOUNT=5000
TEST_ORDER_ID="TEST_MTN_$(date +%s)"

echo "📱 Test avec numéro: $TEST_PHONE"
echo "💰 Montant: $TEST_AMOUNT FCFA"
echo "🆔 Order ID: $TEST_ORDER_ID"
echo ""

# Test 1: Vérifier que l'API est accessible
echo "🔍 Test 1: Vérification de l'accessibilité de l'API..."
if curl -s -f "$API_URL/health" > /dev/null; then
    echo "✅ API accessible"
else
    echo "❌ API non accessible"
    exit 1
fi

# Test 2: Test de paiement MTN Mobile Money
echo ""
echo "💳 Test 2: Test de paiement MTN Mobile Money..."
PAYMENT_RESPONSE=$(curl -s -X POST "$API_URL/payments/process" \
    -H "Content-Type: application/json" \
    -d "{
        \"amount\": $TEST_AMOUNT,
        \"method\": \"MTN_MOBILE_MONEY\",
        \"phoneNumber\": \"$TEST_PHONE\",
        \"orderId\": \"$TEST_ORDER_ID\",
        \"description\": \"Test API MTN Mobile Money\"
    }")

echo "📤 Requête envoyée"
echo "📥 Réponse reçue: $PAYMENT_RESPONSE"

# Vérifier si la réponse contient "success"
if echo "$PAYMENT_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Paiement MTN Mobile Money réussi"
    
    # Extraire l'ID de transaction
    TRANSACTION_ID=$(echo "$PAYMENT_RESPONSE" | grep -o '"transactionId":"[^"]*"' | cut -d'"' -f4)
    echo "🆔 Transaction ID: $TRANSACTION_ID"
else
    echo "❌ Échec du paiement MTN Mobile Money"
    echo "📋 Détails: $PAYMENT_RESPONSE"
fi

echo ""
echo "📊 Résumé des tests..."
echo "======================"
echo "✅ API accessible"
if echo "$PAYMENT_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Paiement MTN Mobile Money fonctionnel"
    echo "🎉 Tous les tests sont passés avec succès !"
else
    echo "❌ Paiement MTN Mobile Money en échec"
    echo "🔧 Vérifiez la configuration et les logs"
fi 